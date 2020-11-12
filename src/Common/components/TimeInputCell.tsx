import React from 'react';
import { AMPM, StateProps } from '../types';

export interface TimeInputType {
    hour: number;
    minute: number;
    ampm: AMPM;
}

interface TimeInputCellProps extends StateProps<TimeInputType> {
    showReset?: boolean;
}

const TimeInputCell: React.FC<TimeInputCellProps> = ({ state, setState, showReset }) => {
    const [timeInput, setTimeInput] = [state, setState];
    const handleChangeTime = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const name = event.target.name;
        const value = parseInt(event.target.value, 10);
        setTimeInput({ ...timeInput, [name]: value });
    };

    const handleToggleAMPM = () => {
        if (timeInput.ampm === 'AM') {
            setTimeInput({ ...timeInput, ampm: 'PM' });
        } else {
            setTimeInput({ ...timeInput, ampm: 'AM' });
        }
    };

    const handleClickReset = () => {
        setTimeInput(getCurrentTime());
    };

    return (
        <div>
            <label>
                {'Time: '}
                <select value={timeInput.hour} name="hour" onChange={handleChangeTime}>
                    {getHourOptions()}
                </select>
                <span style={{ fontWeight: 'bold' }}>{' : '}</span>
                <select value={timeInput.minute} name="minute" onChange={handleChangeTime}>
                    {getMinuteOptions()}
                </select>
                <span style={{ fontWeight: 'bold' }}>{' ' + timeInput.ampm + ' '}</span>
                <button onClick={handleToggleAMPM}>{'Toggle'}</button>
                <br />
                {showReset ? <button onClick={handleClickReset}>{'Reset Time'}</button> : null}
            </label>
        </div>
    );
};

export const getCurrentTime = (): TimeInputType => {
    const now = new Date(Date.now());
    const rawHour = now.getHours();
    const hour = rawHour % 12 === 0 ? 12 : rawHour % 12;
    const minute = now.getMinutes();
    const ampm = rawHour < 12 ? 'AM' : 'PM';
    return {
        hour: hour,
        minute: minute,
        ampm: ampm,
    };
};

const getHourOptions = () => {
    const options: JSX.Element[] = [];
    let i: number;
    options.push(<option value={12}>{12}</option>);
    for (i = 1; i <= 11; i++) {
        options.push(<option value={i}>{i}</option>);
    }
    return options;
};

const getMinuteOptions = () => {
    const options: JSX.Element[] = [];
    let i: number;
    for (i = 0; i < 10; i++) {
        options.push(<option value={i}>{'0' + i}</option>);
    }
    for (i = 10; i < 60; i++) {
        options.push(<option value={i}>{i}</option>);
    }
    return options;
};

export interface TimeInfo {
    hour: number;
    minute: number;
}

export const convertToTime = (input: TimeInputType): TimeInfo => {
    let hour: number;
    if (input.ampm === 'AM') {
        hour = input.hour === 12 ? 0 : input.hour;
    } else {
        hour = input.hour === 12 ? 12 : input.hour + 12;
    }
    const minute = input.minute;
    return {
        hour: hour,
        minute: minute,
    };
};

export { TimeInputCell };
