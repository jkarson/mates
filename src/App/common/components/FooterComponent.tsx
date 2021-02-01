import React from 'react';
import '../styles/FooterComponent.css';

interface FooterComponentProps {
    buttons: JSX.Element[];
}

const FooterComponent: React.FC<FooterComponentProps> = ({ buttons }) => {
    return <div className="footer-container">{buttons}</div>;
};

export default FooterComponent;
