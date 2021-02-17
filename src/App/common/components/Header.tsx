import React from 'react';

import '../styles/Header.css';

interface HeaderProps {
    onClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClick }) => (
    <div className="header-container">
        <div className="header-container-logo-container" onClick={onClick}>
            <span>{'mates'}</span>
        </div>
        <div className="header-container-subheader-container">
            <span>{'where roommates do roommate stuff'}</span>
        </div>
    </div>
);

export default Header;
