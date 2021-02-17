import React, { useLayoutEffect, useState } from 'react';
import Tabs from '../../common/components/Tabs';
import { MatesUserContext } from '../../common/context';
import { assertUnreachable } from '../../common/utilities';
import PageCell from '../../common/components/PageCell';
import { matesTabNames, MatesTabType } from './MatesTabs';
import { Apartment, MatesUser } from '../../common/models';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { initializeServerMessages } from './Messages/utilities';
import { initializeServerBillsInfo } from './Bills/utilities';
import { initializeServerContacts } from './Contacts/utilities';
import { initializeServerFriendsInfo } from './Friends/utilities';
import { initializeServerChoresInfo } from './Chores/utilities';
import { initializeServerEventsInfo } from './Events/utilities';
import { ServerApartment } from '../../common/serverModels';
import ProfileLink from '../../common/components/ProfileLink';
import ApartmentLink from '../../common/components/ApartmentLink';
import ServerErrorPageCell from '../../common/components/ServerErrorPageCell';
import Profile from './Profile/Profile';
import Messages from './Messages/Messages';
import Contacts from './Contacts/Contacts';
import Friends from './Friends/Friends';
import Bills from './Bills/Bills';
import Chores from './Chores/Chores';
import LoadingPageCell from '../../common/components/LoadingPageCell';
import Events from './Events/Events';

import './Mates.css';

//Extension: Tab notifications

//Extension: profile pics

// Extension: we should switch from rendering client side
// to server side eventually, but since it requires fully
// built react pages, let's render react-side for development

//Extension: "Transactionalize" server interactions

//Extension: Protect against useEffect dependency array bugs

//to do: root dir issue

const Mates: React.FC<RouteComponentProps> = (props) => {
    const [tab, setTab] = useState<MatesTabType>('Profile');
    const [matesUser, setMatesUser] = useState<MatesUser | null>(null);
    const [redirect, setRedirect] = useState(false);
    const [accountRedirect, setAccountRedirect] = useState(false);
    const [serverError, setServerError] = useState(false);

    useLayoutEffect(() => {
        fetch('/mates')
            .then((response) => response.json())
            .then((json) => {
                setServerError(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setAccountRedirect(true);
                    return;
                }
                const { userId, apartment, username } = json;
                const formattedApartment = initializeServerApartment(apartment);
                setMatesUser({ userId: userId, apartment: formattedApartment, username: username });
            })
            .catch(() => setServerError(true));
    }, []);

    let currentComponent: JSX.Element | undefined;
    switch (tab) {
        case 'Bills':
            currentComponent = <Bills />;
            break;
        case 'Chores':
            currentComponent = <Chores />;
            break;
        case 'Events':
            currentComponent = <Events />;
            break;
        case 'Friends':
            currentComponent = <Friends />;
            break;
        case 'Contacts':
            currentComponent = <Contacts />;
            break;
        case 'Messages':
            currentComponent = <Messages />;
            break;
        case 'Profile':
            currentComponent = <Profile />;
            break;
        default:
            assertUnreachable(tab);
    }

    if (redirect) {
        return <Redirect to="/" />;
    }
    if (accountRedirect) {
        return <Redirect to="/account" />;
    }
    if (!matesUser) {
        if (!serverError) {
            return <LoadingPageCell />;
        }
        return <ServerErrorPageCell />;
    }

    const handleProfileLinkClick = () => {
        props.history.push('account-settings');
    };

    const handleApartmentLinkClick = () => {
        props.history.go(0);
    };

    return (
        <MatesUserContext.Provider
            value={{
                matesUser: matesUser,
                setMatesUser: setMatesUser as React.Dispatch<React.SetStateAction<MatesUser>>,
            }}
        >
            <div className="mates-container">
                <PageCell
                    onHeaderClick={() => props.history.push('/account')}
                    tabs={<Tabs currentTab={tab} setTab={setTab} tabNames={matesTabNames} />}
                    content={
                        <div className="mates-content-container">
                            <ProfileLink
                                accountName={matesUser.username}
                                onClick={handleProfileLinkClick}
                            />
                            <ApartmentLink
                                apartmentName={matesUser.apartment.profile.name}
                                onClick={handleApartmentLinkClick}
                            />
                            {currentComponent}
                        </div>
                    }
                />
            </div>
        </MatesUserContext.Provider>
    );
};

const initializeServerApartment = (apartment: ServerApartment): Apartment => {
    initializeServerMessages(apartment.messages);
    initializeServerBillsInfo(apartment.billsInfo);
    initializeServerChoresInfo(apartment.choresInfo);
    initializeServerContacts(apartment.manuallyAddedContacts);
    initializeServerFriendsInfo(apartment.friendsInfo);
    initializeServerEventsInfo(apartment.eventsInfo);
    return (apartment as unknown) as Apartment;
};

export default Mates;
