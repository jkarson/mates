import React from 'react';
import StyledInput, { StyledInputProps } from './StyledInput';

import '../styles/BiggerStyledInput.css';

const BiggerStyledInput: React.FC<StyledInputProps> = (props) => {
    return (
        <div className="bigger-styled-input-container">
            <StyledInput {...props} />
        </div>
    );
};

export const SmallerStyledInput: React.FC<StyledInputProps> = (props) => {
    return (
        <div className="smaller-styled-input-container">
            <StyledInput {...props} />
        </div>
    );
};

export default BiggerStyledInput;
