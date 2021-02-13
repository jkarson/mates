import React from 'react';
import { months } from '../constants';
import { StateProps, Month } from '../types';
import {
    getMonthIndexByMonth,
    getDaysInMonth,
    getMonthByIndex,
    getTodaysDate,
    getDayFromDayIndex,
} from '../utilities';

import '../styles/DateInputCell.css';
import SimpleButton from './SimpleButton';
import StyledSelect from './StyledSelect';

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
        const tempDate = new Date(dateInput.getTime());
        tempDate.setMonth(newMonthIndex, newDay);
        setDateInput(tempDate);
    };

    const handleChangeYear = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = parseInt(event.target.value, 10);
        const monthIndex = dateInput.getMonth();
        const month = getMonthByIndex(monthIndex);
        let currentDay = dateInput.getDate();
        const daysInNewMonth = getDaysInMonth(month, newYear);
        if (currentDay > daysInNewMonth) {
            currentDay = daysInNewMonth;
        }
        const tempDate = new Date(dateInput.getTime());
        tempDate.setFullYear(newYear, monthIndex, currentDay);
        setDateInput(tempDate);
    };

    const handleChangeDay = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(event.target.value, 10);
        const tempDate = new Date(dateInput.getTime());
        tempDate.setDate(value);
        setDateInput(tempDate);
    };

    const handleClickReset = () => {
        setDateInput(getTodaysDate());
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

    const getMonthOptions = () => {
        return months.map((month, index) => (
            <option value={month} key={index}>
                {month}
            </option>
        ));
    };

    const getYearOptions = () => {
        const options: JSX.Element[] = [];
        const today = getTodaysDate();
        const currentYear = today.getFullYear();
        let optionYear: number = currentYear - 5;
        for (optionYear; optionYear < currentYear + 15; optionYear++) {
            options.push(
                <option value={optionYear} key={optionYear}>
                    {optionYear}
                </option>,
            );
        }
        return options;
    };

    return (
        <div className="date-input-cell-container">
            <span>{getDayFromDayIndex(dateInput.getDay()) + ','}</span>
            <StyledSelect
                value={getMonthByIndex(dateInput.getMonth())}
                onChange={handleChangeMonth}
                options={getMonthOptions()}
            />
            <StyledSelect
                value={dateInput.getDate()}
                onChange={handleChangeDay}
                options={getDayOptions(dateInput.getMonth(), dateInput.getFullYear())}
            />
            <div className="date-input-cell-year-container">
                <StyledSelect
                    value={dateInput.getFullYear()}
                    onChange={handleChangeYear}
                    options={getYearOptions()}
                />
            </div>
            {showReset ? (
                <div className="date-input-cell-reset-button-container">
                    <SimpleButton onClick={handleClickReset} text={'Reset'} />
                </div>
            ) : null}
        </div>
    );
};

export default DateInputCell;
