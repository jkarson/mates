import React, { useState } from 'react';
import FooterButton from '../../../common/components/FooterButton';
import FooterComponent from '../../../common/components/FooterComponent';
import PageCell from '../../../common/components/PageCell';
import Tabs from '../../../common/components/Tabs';
import { MatesUserContext } from '../../../common/context';
import { MatesUser } from '../../../common/models';
import { assertUnreachable } from '../../../common/utilities';
import Contacts from '../../mates/Contacts/components/Contacts';
import Friends from '../../mates/Friends/components/Friends';
import { matesTabNames, MatesTabType } from '../../mates/MatesTabs';
import Messages from '../../mates/Messages/components/Messages';
import Profile from '../../mates/Profile/components/Profile';
import { demoMatesUser } from '../models/mockData';
import DemoBills from './DemoBills';
import DemoChores from './DemoChores';
import DemoContacts from './DemoContacts';
import DemoEvents from './DemoEvents';
import DemoFriends from './DemoFriends';
import DemoMessages from './DemoMessages';
import DemoProfile from './DemoProfile';

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
            <PageCell
                tabs={<Tabs currentTab={tab} setTab={setTab} tabNames={matesTabNames} />}
                content={currentComponent}
                // footer={
                //     <FooterComponent
                //         buttons={[
                //             <FooterButton onClick={() => setShowDemo(false)} text="Leave Demo" />,
                //         ]}
                //     />
                // }
            />
        </MatesUserContext.Provider>
    );
};
export default DemoMates;
