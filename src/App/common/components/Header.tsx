import React from 'react';
import '../styles/Header.css';

const Header: React.FC = () => (
    <header>
        <h1 className="header">{'Mates'}</h1>
        <p className="subHeader">{'A place for roommates to do roommate stuff.'}</p>
    </header>
);

export default Header;
