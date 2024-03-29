import React from 'react';
import { DateTimeInputType, StateProps, TimeInputType } from '../types';
import DateInputCell from './DateInputCell';
import TimeInputCell from './TimeInputCell';

import '../styles/DateTimeInputCell.css';

const DateTimeInputCell: React.FC<StateProps<DateTimeInputType>> = ({ state, setState }) => {
    const [dateTimeInput, setDateTimeInput] = [state, setState];

    const handleSetDate = (date: Date) => {
        setDateTimeInput({ ...dateTimeInput, date: date });
    };

    const handleSetTime = (timeInput: TimeInputType) => {
        setDateTimeInput({ ...dateTimeInput, time: timeInput });
    };

    return (
        <div className="date-time-input-cell-container">
            <DateInputCell state={state.date} setState={handleSetDate} showReset={false} />
            <TimeInputCell state={state.time} setState={handleSetTime} showReset={false} />
        </div>
    );
};

export default DateTimeInputCell;
