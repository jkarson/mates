import React from 'react';
import { DateTimeInputType, StateProps, TimeInputType } from '../types';
import { getCurrentDateTime } from '../utilities';
import DateInputCell from './DateInputCell';
import TimeInputCell from './TimeInputCell';

const DateTimeInputCell: React.FC<StateProps<DateTimeInputType>> = ({ state, setState }) => {
    const [dateTimeInput, setDateTimeInput] = [state, setState];

    const handleClickReset = () => {
        setDateTimeInput(getCurrentDateTime());
    };

    const handleSetDate = (date: Date) => {
        setDateTimeInput({ ...dateTimeInput, date: date });
    };

    const handleSetTime = (timeInput: TimeInputType) => {
        setDateTimeInput({ ...dateTimeInput, time: timeInput });
    };

    return (
        <div>
            <DateInputCell state={state.date} setState={handleSetDate} showReset={false} />
            <TimeInputCell state={state.time} setState={handleSetTime} showReset={false} />
            <button onClick={handleClickReset}>{'Reset Date and Time'}</button>
        </div>
    );
};

export default DateTimeInputCell;
