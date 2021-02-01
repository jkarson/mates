import React from 'react';
import '../styles/StyledInput.css';

export interface StyledInputProps {
    type?: string;
    value?: string | number | readonly string[];
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    name?: string;
}

const StyledInput: React.FC<StyledInputProps> = (props) => (
    <input className="styled-input" {...props} />
);

export default StyledInput;
