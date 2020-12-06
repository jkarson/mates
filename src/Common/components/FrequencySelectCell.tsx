import React from 'react';
import { Frequency, StateProps } from '../types';

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
        <div>
            <label>
                {'Repeat: '}
                <select value={state} onChange={handleChange}>
                    {frequencyOptions}
                </select>
            </label>
        </div>
    );
};

export default FrequencySelectCell;
