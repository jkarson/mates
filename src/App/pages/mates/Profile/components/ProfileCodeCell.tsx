import React, { useContext } from 'react';
import StandardStyledText from '../../../../common/components/StandardStyledText';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';

import '../styles/ProfileCodeCell.css';

const ProfileCodeCell: React.FC = () => {
    const { matesUser: user } = useContext(MatesUserContext) as MatesUserContextType;
    const code = user.apartment.profile.code;
    return (
        <div className="profile-code-cell-container">
            <div className="profile-code-cell-description-container">
                <StandardStyledText text={"This is your apartment's unique code."} />
                <StandardStyledText
                    text={'• Other users can use this code to request to join your apartment'}
                />
                <StandardStyledText
                    text={'• Other apartments can use this code to friend request your apartment'}
                />
            </div>
            <div className="profile-code-cell-code-container">
                <span>{code}</span>
            </div>
        </div>
    );
};

export default ProfileCodeCell;
