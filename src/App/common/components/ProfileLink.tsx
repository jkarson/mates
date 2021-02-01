import React from 'react';

import '../styles/ProfileLink.css';

interface ProfileLinkProps {
    accountName: string;
    onClick: () => void;
}

const ProfileLink: React.FC<ProfileLinkProps> = ({ accountName, onClick }) => {
    return (
        <div className="profile-link-container">
            <span onClick={onClick}>{accountName}</span>
        </div>
    );
};

export default ProfileLink;
