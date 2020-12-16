import React, { useState } from 'react';
import PageCell from '../../common/components/PageCell';
import Tabs from '../../common/components/Tabs';
import { accountTabNames, AccountTabType } from './AccountTabs';
import ApartmentsCell from './ApartmentsCell';
import CreateApartmentCell from './CreateApartmentCell';
import JoinApartmentCell from './JoinApartmentCell';

const Account: React.FC = () => {
    const [tab, setTab] = useState<AccountTabType>('Your Apartments');
    const tabs = <Tabs currentTab={tab} setTab={setTab} tabNames={accountTabNames} />;

    let currentComponent: JSX.Element | undefined;
    switch (tab) {
        case 'Create An Apartment':
            currentComponent = <CreateApartmentCell />;
            break;
        case 'Join An Apartment':
            currentComponent = <JoinApartmentCell />;
            break;
        case 'Your Apartments':
            currentComponent = <ApartmentsCell />;
            break;
    }
    return <PageCell tabs={tabs} content={currentComponent} />;
};

export default Account;
