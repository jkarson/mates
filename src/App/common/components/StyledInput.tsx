import React, { forwardRef } from 'react';
import '../styles/StyledInput.css';

export interface StyledInputProps {
    type?: string;
    value?: string | number | readonly string[];
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    name?: string;
    onFocus?: () => void;
    onBlur?: () => void;
}

const StyledInput: React.FC<StyledInputProps> = (props) => (
    <input className="styled-input" {...props} />
);

export const StyledInputWithRef = forwardRef<HTMLInputElement, StyledInputProps>((props, ref) => {
    return <input className="styled-input" {...props} ref={ref} />;
});

export default StyledInput;
