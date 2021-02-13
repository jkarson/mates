import React from 'react';
import { Frequency, StateProps } from '../types';
import StyledSelect from './StyledSelect';

import '../styles/FrequencySelectCell.css';

interface FrequencySelectCellProps<T> extends StateProps<T> {
    frequencies: readonly T[];
}

const FrequencySelectCell = <T extends Frequency>({
    state,
    setState,
    frequencies,
}: FrequencySelectCellProps<T>) => {
    const frequencyOptions = frequencies.map((frequency, index) => (
        <option value={frequency} key={index}>
            {frequency}
        </option>
    ));
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFrequency = event.target.value as T;
        setState(selectedFrequency);
    };
    return (
        <div className="frequency-select-cell-container">
            <span className="frequency-select-cell-text-container">{'Repeat: '}</span>
            <StyledSelect value={state} onChange={handleChange} options={frequencyOptions} />
        </div>
    );
};

export default FrequencySelectCell;
