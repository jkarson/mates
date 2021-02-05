import React from 'react';

import '../styles/ProfileLink.css';

interface ProfileLinkProps {
    accountName: string;
    onClick: () => void;
}

const ProfileLink: React.FC<ProfileLinkProps> = ({ accountName, onClick }) => {
    return (
        <div className="profile-link-container" onClick={onClick}>
            <div className="profile-link-name-container">
                <span>{accountName}</span>
            </div>
        </div>
    );
};

export default ProfileLink;
