import React, { useContext, useLayoutEffect, useState } from 'react';
import Tabs from '../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { assertUnreachable } from '../../../common/utilities';
import CreateFriendRequestCell from './components/CreateFriendRequestCell';
import FriendsCell from './components/FriendsCell';
import RequestsCell from './components/RequestsCell';
import { FriendsTabType, friendsTabNames } from './models/FriendsTabs';

import './Friends.css';

const Friends: React.FC = () => {
    const [tab, setTab] = useState<FriendsTabType>('Friends');
    const { matesUser } = useContext(MatesUserContext) as MatesUserContextType;

    useLayoutEffect(() => {
        if (matesUser.apartment.friendsInfo.incomingRequests.length > 0) {
            setTab('Incoming Requests');
            return;
        }
        if (matesUser.apartment.friendsInfo.friends.length > 0) {
            setTab('Friends');
            return;
        }
        setTab('Add New Friend');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let content: JSX.Element;
    switch (tab) {
        case 'Friends':
            content = <FriendsCell />;
            break;
        case 'Incoming Requests':
            content = <RequestsCell incoming={true} setTab={setTab} tab={tab} />;
            break;
        case 'Outgoing Requests':
            content = <RequestsCell incoming={false} setTab={setTab} tab={tab} />;
            break;
        case 'Add New Friend':
            content = <CreateFriendRequestCell setTab={setTab} />;
            break;
        default:
            assertUnreachable(tab);
    }

    return (
        <div className="friends-container">
            <div className="friends-tabs-container">
                <Tabs<FriendsTabType> currentTab={tab} setTab={setTab} tabNames={friendsTabNames} />
            </div>
            <div className="friends-content-container">{content}</div>
        </div>
    );
};

export default Friends;
