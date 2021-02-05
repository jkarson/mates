import React from 'react';

import '../styles/StyledSelect.css';

interface StyledSelectProps {
    value: string | number | readonly string[];
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: JSX.Element[];
    name?: string;
}

const StyledSelect: React.FC<StyledSelectProps> = ({ value, onChange, options, name }) => (
    <div className="styled-select-container">
        <select value={value} onChange={onChange} name={name}>
            {options}
        </select>
    </div>
);

export default StyledSelect;
