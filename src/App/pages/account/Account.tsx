import React, { useLayoutEffect, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import PageCell from '../../common/components/PageCell';
import Tabs from '../../common/components/Tabs';
import { AccountContext } from '../../common/context';
import { User } from '../../common/models';
import { accountTabNames, AccountTabType } from './AccountTabs';
import ApartmentsCell from './ApartmentsCell';
import CreateApartmentCell from './CreateApartmentCell';
import JoinApartmentCell from './JoinApartmentCell';
import JoinRequestsCell from './JoinRequestsCell';

const Account: React.FC<RouteComponentProps> = (props) => {
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    const [user, setUser] = useState<User | null>(null);

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
                    const user = json.user;
                    setUser({ ...user });
                }
            })
            .catch((err) => console.error(err));
    }, []);

    const [tab, setTab] = useState<AccountTabType>('Your Apartments');
    const tabs = <Tabs currentTab={tab} setTab={setTab} tabNames={accountTabNames} />;

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
            <div>
                <PageCell
                    tabs={tabs}
                    content={
                        <div>
                            {!redirectToLogin ? null : <Redirect to="/" />}
                            <h3 style={{ color: 'dodgerblue' }}>
                                {user ? 'Welcome, ' + user.username : null}
                            </h3>
                            {currentComponent}
                        </div>
                    }
                />
            </div>
        </AccountContext.Provider>
    );
};

export default Account;
