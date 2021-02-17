import React from 'react';
import { getInitials } from '../utilities';

import '../styles/Initials.css';

interface InitialsProps {
    name: string;
}
const Initials: React.FC<InitialsProps> = ({ name }) => {
    const initials = getInitials(name);
    return (
        <div>
            <div className="initials-circle">
                <span className="initials-content-container">{initials}</span>
            </div>
        </div>
    );
};

export default Initials;
