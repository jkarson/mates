import React, { forwardRef } from 'react';

import '../styles/StyledInputs.css';

export interface StyledInputProps {
    type?: string;
    value?: string | number | readonly string[];
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    name?: string;
    onFocus?: () => void;
    onBlur?: () => void;
}

export const StyledInput: React.FC<StyledInputProps> = (props) => (
    <input className="styled-input" {...props} />
);

export const StyledInputWithRef = forwardRef<HTMLInputElement, StyledInputProps>((props, ref) => {
    return <input className="styled-input" {...props} ref={ref} />;
});

export const BiggerStyledInput: React.FC<StyledInputProps> = (props) => {
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
