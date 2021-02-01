import React from 'react';
import '../styles/FooterButton.css';

interface FooterButtonProps {
    text: string;
    onClick: () => void;
}

const FooterButton: React.FC<FooterButtonProps> = ({ onClick, text }) => {
    return (
        <button onClick={onClick} className="footer-button">
            {text}
        </button>
    );
};

export default FooterButton;
