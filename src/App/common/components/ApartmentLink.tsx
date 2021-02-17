import React from 'react';
import ApartmentIcon from './ApartmentIcon';

import '../styles/ApartmentLink.css';

interface ApartmentLinkProps {
    apartmentName: string;
    onClick: () => void;
}

const ApartmentLink: React.FC<ApartmentLinkProps> = ({ apartmentName, onClick }) => {
    return (
        <div className="apartment-link-container" onClick={onClick}>
            <div className="apartment-link-inner-container">
                <div className="apartment-link-icon-container">
                    <ApartmentIcon />
                </div>
                <div className="apartment-link-name-container">
                    <span>{apartmentName}</span>
                </div>
            </div>
        </div>
    );
};

export default ApartmentLink;
