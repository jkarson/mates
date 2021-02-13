import React, { useLayoutEffect, useState } from 'react';
import './Mates.css';
import Bills from './Bills/components/Bills';
import Chores from './Chores/components/Chores';
import Events from './Events/components/Events';
import Friends from './Friends/components/Friends';
import Contacts from './Contacts/components/Contacts';
import Messages from './Messages/components/Messages';
import Profile from './Profile/components/Profile';
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
import { ServerContact } from './Contacts/models/ServerContact';
import ProfileLink from '../../common/components/ProfileLink';
import ApartmentLink from '../../common/components/ApartmentLink';

//EXTENSION: Tab notifications. This system may be a bit tricky and will likely involve the server.

//TO DO (After MVP): Make transactions more safe by verifying on the server that things haven't changed
//since the client request... if they have, we would ideally send a message telling the user to reload their page
//especially bills

//to do: profile pics

//TO DO: Full code sweep! Delete unused imports, old comments / debug statements...
//prepare code for production environment.

//to do: make sure every list item has a key!

// to do: we should switch from rendering client side
// to server side eventually, but since it requires fully
// built react pages, let's render react-side for development

//TO DO: wrap content in a scroll view or equivalent so that the tabs/description/
//message are stuck on the top --> see Page Cell

const Mates: React.FC<RouteComponentProps> = (props) => {
    const [tab, setTab] = useState<MatesTabType>('Profile');
    const [matesUser, setMatesUser] = useState<MatesUser | null>(null);
    const [redirect, setRedirect] = useState(false);
    const [accountRedirect, setAccountRedirect] = useState(false);
    const [message, setMessage] = useState('');

    useLayoutEffect(() => {
        fetch('/mates')
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
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
                console.log('setting mates user...');
                console.log(json);
                setMatesUser({ userId: userId, apartment: formattedApartment, username: username });
            });
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
        return null;
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
