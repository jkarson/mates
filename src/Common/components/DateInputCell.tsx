import React from 'react';
import { months } from '../constants';
import { Month, StateProps } from '../types';
import { getDaysInMonth, getMonthByIndex, getMonthIndexByMonth } from '../utilities';

interface DateInputCellProps extends StateProps<Date> {
    showReset?: boolean;
}

const DateInputCell: React.FC<DateInputCellProps> = ({ state, setState, showReset }) => {
    const [dateInput, setDateInput] = [state, setState];

    const handleChangeMonth = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = event.target.value as Month;
        const newMonthIndex = getMonthIndexByMonth(newMonth);
        let newDay = dateInput.getDate();
        const daysInNewMonth = getDaysInMonth(newMonth, dateInput.getFullYear());
        if (newDay > daysInNewMonth) {
            newDay = daysInNewMonth;
        }
        dateInput.setMonth(newMonthIndex, newDay);
        setDateInput(dateInput);
    };

    const handleChangeYear = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newYear = parseInt(event.target.value, 10);
        const monthIndex = dateInput.getMonth();
        const month = getMonthByIndex(monthIndex);
        let currentDay = dateInput.getDate();
        const daysInNewMonth = getDaysInMonth(month, newYear);
        if (currentDay > daysInNewMonth) {
            currentDay = daysInNewMonth;
        }
        dateInput.setFullYear(newYear, monthIndex, currentDay);
        setDateInput(dateInput);
    };

    const handleChangeDay = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(event.target.value, 10);
        dateInput.setDate(value);
        setDateInput(dateInput);
    };

    const handleClickReset = () => {
        setDateInput(new Date(Date.now()));
    };

    return (
        <div>
            <label>
                {'Month: '}
                <select value={getMonthByIndex(dateInput.getMonth())} onChange={handleChangeMonth}>
                    {getMonthOptions()}
                </select>
            </label>
            <br />
            <label>
                {'Day: '}
                <select value={dateInput.getDate()} onChange={handleChangeDay}>
                    {getDayOptions(dateInput.getMonth(), dateInput.getFullYear())}
                </select>
            </label>
            <br />
            <label>
                {'Year: '}
                <input type="number" value={dateInput.getFullYear()} onChange={handleChangeYear} />
            </label>
            <br />
            {showReset ? <button onClick={handleClickReset}>{'Reset Date'}</button> : null}
        </div>
    );
};

const getMonthOptions = () => {
    return months.map((month) => <option value={month}>{month}</option>);
};

const getDayOptions = (monthIndex: number, year: number): JSX.Element[] => {
    const month = getMonthByIndex(monthIndex);
    const days = getDaysInMonth(month, year);
    const options: JSX.Element[] = [];
    let i: number;
    for (i = 1; i <= days; i++) {
        options.push(<option value={i}>{i}</option>);
    }
    return options;
};

export { DateInputCell };
