import React from 'react';
import { StateProps } from '../types';
import { DateInputCell } from './DateInputCell';
import { convertToTime, getCurrentTime, TimeInputCell, TimeInputType } from './TimeInputCell';

export interface DateTimeInputType {
    date: Date;
    time: TimeInputType;
}

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

export const getCurrentDateTime = (): DateTimeInputType => {
    return {
        date: new Date(Date.now()),
        time: getCurrentTime(),
    };
};

export const convertToDateWithTime = (input: DateTimeInputType): Date => {
    const date = input.date;
    const time = convertToTime(input.time);
    date.setHours(time.hour, time.minute);
    return date;
};

export { DateTimeInputCell };
