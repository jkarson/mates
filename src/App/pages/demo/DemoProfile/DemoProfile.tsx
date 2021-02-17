import React, { useState } from 'react';
import Tabs from '../../../common/components/Tabs';
import { assertUnreachable } from '../../../common/utilities';
import ProfileCodeCell from '../../mates/Profile/components/ProfileCodeCell';
import { ProfileTabType, profileTabNames } from '../../mates/Profile/models/ProfileTabs';
import DemoProfileCell from './DemoProfileCell';
import DemoProfileJoinRequestsCell from './DemoProfileJoinRequestsCell';

const DemoProfile: React.FC = () => {
    const [tab, setTab] = useState<ProfileTabType>('Your Profile');

    let content: JSX.Element;
    switch (tab) {
        case 'Your Profile':
            content = <DemoProfileCell />;
            break;
        case 'Join Requests':
            content = <DemoProfileJoinRequestsCell setTab={setTab} />;
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

export default DemoProfile;
