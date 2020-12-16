import React, { useState } from 'react';
import './Mates.css';
import Bills from './Bills/components/Bills';
import Chores from './Chores/components/Chores';
import Events from './Events/components/Events';
import Friends from './Friends/components/Friends';
import Contacts from './Contacts/components/Contacts';
import Messages from './Messages/components/Messages';
import Profile from './Profile/components/Profile';
import Tabs from '../../common/components/Tabs';
import { UserContext } from '../../common/context';
import { Users } from '../../common/mockData';
import { assertUnreachable } from '../../common/utilities';
import PageCell from '../../common/components/PageCell';
import { matesTabNames, MatesTabType } from './MatesTabs';

//PICKUP!
/*
    - Events, Bills, and Chores are refactored (done)
    - Refactor Contacts (done), Friends (done), Messages (done), Profile (done), and Common (done)
    - Identify and fix remaining bugs / todos
    - Incorporate server
*/

//note to self: perhaps all database updates can come via setUser, reducing a million endpoints to one.

//TO DO/EXTENSION: Tab notifications. This system may be a bit tricky and will likely involve the server.

const Mates: React.FC = () => {
    /*const [users, setUsers] = useState<any>(null);
    useLayoutEffect(() => {
        fetch('/api')
            .then((res) => res.json())
            .then((json) => {
                setUsers(json);
                console.log(json);
            });
        //.then((val) => console.log(val));
        // .then((users) => console.log(users));
    }, []);*/

    const [tab, setTab] = useState<MatesTabType>('Profile');

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

    const [user, setUser] = useState(Users.Jeremy);

    return (
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
            <PageCell
                tabs={<Tabs currentTab={tab} setTab={setTab} tabNames={matesTabNames} />}
                content={currentComponent}
            />
        </UserContext.Provider>
    );
};

export default Mates;
