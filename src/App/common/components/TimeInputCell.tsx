import React from 'react';
import { StateProps, TimeInputType } from '../types';
import { getCurrentTime } from '../utilities';
import SimpleButton from './SimpleButton';

import '../styles/TimeInputCell.css';
import StyledSelect from './StyledSelect';

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

    return (
        <div className="time-input-cell-container">
            <div className="time-input-cell-input-container">
                <span>{'Time: '}</span>
                <StyledSelect
                    value={timeInput.hour}
                    name="hour"
                    onChange={handleChangeTime}
                    options={getHourOptions()}
                />
                <span>{' : '}</span>
                <StyledSelect
                    value={timeInput.minute}
                    name="minute"
                    onChange={handleChangeTime}
                    options={getMinuteOptions()}
                />
                <span>{' ' + timeInput.ampm + ' '}</span>
                <SimpleButton onClick={handleToggleAMPM} text={'Toggle'} />
            </div>
            <div className="time-input-cell-reset-button-container">
                {showReset ? <SimpleButton onClick={handleClickReset} text={'Reset Time'} /> : null}
            </div>
        </div>
    );
};

export default TimeInputCell;
