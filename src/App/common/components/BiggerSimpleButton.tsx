import React from 'react';
import SimpleButton, { SimpleButtonProps } from './SimpleButton';

import '../styles/BiggerSimpleButton.css';

const BiggerSimpleButton: React.FC<SimpleButtonProps> = ({ onClick, text }) => {
    return (
        <div className="bigger-simple-button-container">
            <SimpleButton onClick={onClick} text={text} />
        </div>
    );
};

export const HugeSimpleButton: React.FC<SimpleButtonProps> = ({ onClick, text }) => {
    return (
        <div className="huge-simple-button-container">
            <SimpleButton onClick={onClick} text={text} />
        </div>
    );
};

export default BiggerSimpleButton;
