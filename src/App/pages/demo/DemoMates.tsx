import React, { useState } from 'react';
import PageCell from '../../common/components/PageCell';
import Tabs from '../../common/components/Tabs';
import { MatesUserContext } from '../../common/context';
import { MatesUser } from '../../common/models';
import { assertUnreachable } from '../../common/utilities';
import { MatesTabType, matesTabNames } from '../mates/MatesTabs';
import DemoBills from './DemoBills/DemoBills';
import DemoChores from './DemoChores/DemoChores';
import DemoContacts from './DemoContacts/DemoContacts';
import DemoEvents from './DemoEvents/DemoEvents';
import DemoFriends from './DemoFriends/DemoFriends';
import DemoMessages from './DemoMessages/DemoMessages';
import DemoProfile from './DemoProfile/DemoProfile';
import { demoMatesUser } from './mockData';

import '../../pages/mates/Mates.css';

interface DemoMatesProps {
    setShowDemo: (value: React.SetStateAction<boolean>) => void;
}

const DemoMates: React.FC<DemoMatesProps> = ({ setShowDemo }) => {
    const [tab, setTab] = useState<MatesTabType>('Profile');
    const [matesUser, setMatesUser] = useState<MatesUser>(demoMatesUser);

    let currentComponent: JSX.Element | undefined;
    switch (tab) {
        case 'Bills':
            currentComponent = <DemoBills />;
            break;
        case 'Chores':
            currentComponent = <DemoChores />;
            break;
        case 'Events':
            currentComponent = <DemoEvents />;
            break;
        case 'Friends':
            currentComponent = <DemoFriends />;
            break;
        case 'Contacts':
            currentComponent = <DemoContacts />;
            break;
        case 'Messages':
            currentComponent = <DemoMessages />;
            break;
        case 'Profile':
            currentComponent = <DemoProfile />;
            break;
        default:
            assertUnreachable(tab);
    }

    return (
        <MatesUserContext.Provider
            value={{
                matesUser: matesUser,
                setMatesUser: setMatesUser as React.Dispatch<React.SetStateAction<MatesUser>>,
            }}
        >
            <div className="mates-container">
                <PageCell
                    onHeaderClick={() => setShowDemo(false)}
                    tabs={<Tabs currentTab={tab} setTab={setTab} tabNames={matesTabNames} />}
                    content={<div className="mates-content-container">{currentComponent}</div>}
                />
            </div>
        </MatesUserContext.Provider>
    );
};
export default DemoMates;
