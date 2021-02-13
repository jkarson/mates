import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import PageCell from '../../common/components/PageCell';
import Tabs from '../../common/components/Tabs';
import { AccountContext } from '../../common/context';
import { User } from '../../common/models';
import ApartmentsCell from './components/ApartmentsCell';
import CreateApartmentCell from './components/CreateApartmentCell';
import JoinApartmentCell from './components/JoinApartmentCell';
import JoinRequestsCell from './components/JoinRequestsCell';
import { AccountTabType, accountTabNames } from './models/AccountTabs';

import './Account.css';
import RedMessageCell from '../../common/components/RedMessageCell';
import ProfileLink from '../../common/components/ProfileLink';
import ApartmentLink from '../../common/components/ApartmentLink';

const Account: React.FC<RouteComponentProps> = (props) => {
    const [user, setUser] = useState<User | null>(null);
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    useLayoutEffect(() => {
        fetch('/account')
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                const { authenticated } = json;
                if (!authenticated) {
                    console.log('initiating redirect');
                    setRedirectToLogin(true);
                } else {
                    const { user } = json;
                    setUser({ ...user });
                }
            })
            .catch((err) => console.error(err));
    }, []);

    const [tab, setTab] = useState<AccountTabType>('Your Apartments');
    const tabs = <Tabs currentTab={tab} setTab={setTab} tabNames={accountTabNames} />;

    const handleProfileLinkClick = () => {
        props.history.push('account-settings');
    };

    let currentComponent: JSX.Element | undefined;
    switch (tab) {
        case 'Create An Apartment':
            currentComponent = <CreateApartmentCell setTab={setTab} />;
            break;
        case 'Join An Apartment':
            currentComponent = <JoinApartmentCell setTab={setTab} />;
            break;
        case 'Your Join Requests':
            currentComponent = <JoinRequestsCell />;
            break;
        case 'Your Apartments':
            currentComponent = <ApartmentsCell {...props} />;
            break;
    }

    if (redirectToLogin) {
        return <Redirect to="/" />;
    }

    if (!user) {
        return null;
    }

    return (
        <AccountContext.Provider
            value={{ user: user, setUser: setUser as React.Dispatch<React.SetStateAction<User>> }}
        >
            <div className="account-container">
                <PageCell
                    onHeaderClick={() => props.history.go(0)}
                    tabs={tabs}
                    content={
                        <div className="account-content-container">
                            <ProfileLink
                                accountName={user.username}
                                onClick={handleProfileLinkClick}
                            />
                            {user.selectedApartmentName ? (
                                <ApartmentLink
                                    apartmentName={user.selectedApartmentName}
                                    onClick={() => props.history.push('mates')}
                                />
                            ) : null}
                            {currentComponent}
                        </div>
                    }
                />
            </div>
        </AccountContext.Provider>
    );
};

export default Account;
