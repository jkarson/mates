import React, { useContext, useLayoutEffect, useState } from 'react';
import Tabs from '../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { assertUnreachable } from '../../../common/utilities';
import { FriendsTabType, friendsTabNames } from '../../mates/Friends/models/FriendsTabs';
import DemoCreateFriendRequestCell from './DemoCreateFriendRequestCell';
import DemoFriendsCell from './DemoFriendsCell';
import DemoRequestsCell from './DemoRequestsCell';

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
            content = <DemoFriendsCell />;
            break;
        case 'Incoming Requests':
            content = <DemoRequestsCell incoming={true} setTab={setTab} tab={tab} />;
            break;
        case 'Outgoing Requests':
            content = <DemoRequestsCell incoming={false} setTab={setTab} tab={tab} />;
            break;
        case 'Add New Friend':
            content = <DemoCreateFriendRequestCell />;
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
