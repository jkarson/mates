import React, { useLayoutEffect, useState } from 'react';
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
import ProfileLink from '../../common/components/ProfileLink';
import ApartmentLink from '../../common/components/ApartmentLink';
import ServerErrorPageCell from '../../common/components/ServerErrorPageCell';
import LoadingPageCell from '../../common/components/LoadingPageCell';

import './Account.css';

const Account: React.FC<RouteComponentProps> = (props) => {
    const [user, setUser] = useState<User | null>(null);
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const [serverError, setServerError] = useState(false);

    const [tab, setTab] = useState<AccountTabType>('Your Apartments');
    const tabs = <Tabs currentTab={tab} setTab={setTab} tabNames={accountTabNames} />;

    useLayoutEffect(() => {
        fetch('/account/get')
            .then((response) => response.json())
            .then((json) => {
                setServerError(false);
                const { authenticated } = json;
                if (!authenticated) {
                    setRedirectToLogin(true);
                } else {
                    const { user } = json;
                    setUser({ ...user });
                }
            })
            .catch(() => setServerError(true));
    }, []);

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
        if (!serverError) {
            return <LoadingPageCell />;
        } else {
            return <ServerErrorPageCell />;
        }
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
