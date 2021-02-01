import React from 'react';
import '../styles/SimpleButton.css';

export interface SimpleButtonProps {
    onClick: () => void;
    text: string;
}

const SimpleButton: React.FC<SimpleButtonProps> = ({ onClick, text }) => {
    return (
        <button className="simple-button" onClick={onClick}>
            {text}
        </button>
    );
};

export default SimpleButton;
