import React, { useContext, useLayoutEffect, useState } from 'react';
import Tabs from '../../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { assertUnreachable } from '../../../../common/utilities';
import { profileTabNames, ProfileTabType } from '../models/ProfileTabs';
import ProfileCodeCell from './ProfileCodeCell';
import ProfileCell from './ProfileCell';
import ProfileJoinRequestsCell from './ProfileJoinRequestsCell';

import '../styles/Profile.css';

//EXTENSION: Could incorporate birthdays, calculate age automatically,
//send a notification, make it pretty, etc

//EXTENSION: add photo to apartment profile

//EXTENSION: Make profiles more customizable, perhaps text colors and perhaps individual-level
// photos

//EXTENSION: Quotes for individuals

const Profile: React.FC = () => {
    const { matesUser: user } = useContext(MatesUserContext) as MatesUserContextType;
    const [tab, setTab] = useState<ProfileTabType>('Your Profile');
    useLayoutEffect(() => {
        if (user.apartment.profile.requests.length > 0) {
            setTab('Join Requests');
        }
    }, []);

    let content: JSX.Element;
    switch (tab) {
        case 'Your Profile':
            content = <ProfileCell />;
            break;
        case 'Join Requests':
            content = <ProfileJoinRequestsCell setTab={setTab} />;
            break;
        case 'Your Unique Code':
            content = <ProfileCodeCell />;
            break;
        default:
            assertUnreachable(tab);
    }

    return (
        <div className="profile-container">
            <Tabs currentTab={tab} setTab={setTab} tabNames={profileTabNames} />
            <div className="profile-content-container">{content}</div>
        </div>
    );
};

export default Profile;
