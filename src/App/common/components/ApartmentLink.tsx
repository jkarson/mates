import React from 'react';

import '../styles/ApartmentLink.css';
import ApartmentIcon from './ApartmentIcon';

interface ApartmentLinkProps {
    apartmentName: string;
    onClick: () => void;
}

const ApartmentLink: React.FC<ApartmentLinkProps> = ({ apartmentName, onClick }) => {
    return (
        <div className="apartment-link-container">
            <div className="apartment-link-inner-container" onClick={onClick}>
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
