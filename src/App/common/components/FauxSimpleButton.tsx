import React from 'react';
import SimpleButton from './SimpleButton';

import '../styles/FauxSimpleButton.css';
import BiggerSimpleButton from './BiggerSimpleButton';

interface FauxSimpleButtonProps {
    text: string;
}

const FauxSimpleButton: React.FC<FauxSimpleButtonProps> = ({ text }) => (
    <div className="faux-simple-button-container">
        <SimpleButton
            text={text}
            onClick={() => {
                return;
            }}
        />
    </div>
);

export const BiggerFauxSimpleButton: React.FC<FauxSimpleButtonProps> = ({ text }) => (
    <div className="faux-simple-button-container">
        <BiggerSimpleButton
            text={text}
            onClick={() => {
                return;
            }}
        />
    </div>
);

export default FauxSimpleButton;
