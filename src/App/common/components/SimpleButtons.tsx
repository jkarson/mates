import React from 'react';

import '../styles/SimpleButtons.css';

interface SimpleButtonProps {
    onClick: () => void;
    text: string;
}

export const SimpleButton: React.FC<SimpleButtonProps> = ({ onClick, text }) => {
    return (
        <button className="simple-button" onClick={onClick}>
            {text}
        </button>
    );
};

export const BiggerSimpleButton: React.FC<SimpleButtonProps> = ({ onClick, text }) => {
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
