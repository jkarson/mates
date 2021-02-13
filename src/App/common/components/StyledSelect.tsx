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
        <div className="styled-select-icon-container">
            <i className="fa fa-caret-down" />
        </div>
    </div>
);

export default StyledSelect;
