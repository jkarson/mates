import React from 'react';
import { SimpleButton, BiggerSimpleButton } from './SimpleButtons';

import '../styles/FauxSimpleButtons.css';

interface FauxSimpleButtonProps {
    text: string;
}

export const FauxSimpleButton: React.FC<FauxSimpleButtonProps> = ({ text }) => (
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
