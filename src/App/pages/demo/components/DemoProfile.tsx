import React, { useContext, useState } from 'react';
import DescriptionCell from '../../../common/components/DescriptionCell';
import Tabs from '../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { assertUnreachable } from '../../../common/utilities';
import ProfileJoinRequestCell from '../../mates/Profile/components/ProfileJoinRequestCell';
import { JoinRequest } from '../../mates/Profile/models/ProfileInfo';
import { ProfileTabType, profileTabNames } from '../../mates/Profile/models/ProfileTabs';
import DemoModifiableApartmentProfile from './DemoModifiableApartmentProfile';
import { DemoTenantsProfileCell } from './DemoTenantsProfileCell';

const DemoProfile: React.FC = () => {
    const { matesUser: user } = useContext(MatesUserContext) as MatesUserContextType;
    console.log('bills info:');
    console.log(user.apartment.billsInfo);
    const [tab, setTab] = useState<ProfileTabType>('Your Profile');

    //Remove this effect in demo mode.
    /*useLayoutEffect(() => {
        if (user.apartment.profile.requests.length > 0) {
            setTab('Join Requests');
        }
    }, []);*/

    let content: JSX.Element;
    switch (tab) {
        case 'Your Profile':
            content = <ProfileCell />;
            break;
        case 'Join Requests':
            content = <ProfileJoinRequestsCell setTab={setTab} />;
            break;
        case 'Your Unique Code':
            content = <ProfileCodeCell />;
            break;
        default:
            assertUnreachable(tab);
    }

    return (
        <div>
            <Tabs currentTab={tab} setTab={setTab} tabNames={profileTabNames} />
            {content}
        </div>
    );
};

const ProfileCell: React.FC = () => {
    const { matesUser: user } = useContext(MatesUserContext) as MatesUserContextType;
    return (
        <div>
            <DemoModifiableApartmentProfile />
            <DemoTenantsProfileCell
                tenants={user.apartment.tenants}
                includesUser={true}
                userId={user.userId}
            />
        </div>
    );
};

interface ProfileJoinRequestsCellProps {
    setTab: React.Dispatch<React.SetStateAction<ProfileTabType>>;
}

const ProfileJoinRequestsCell: React.FC<ProfileJoinRequestsCellProps> = ({ setTab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;
    const joinRequests = user.apartment.profile.requests;

    const [error, setError] = useState('');

    const handleAccept = (joinRequest: JoinRequest) => {
        const requestIndex = user.apartment.profile.requests.findIndex(
            (request) => request._id === joinRequest._id,
        );
        if (requestIndex !== -1) {
            user.apartment.profile.requests.splice(requestIndex, 1);
        }
        user.apartment.tenants.push({
            userId: joinRequest._id,
            name: joinRequest.username,
        });
        setUser({ ...user });
        setTab('Your Profile');
    };

    const handleDelete = (joinRequest: JoinRequest) => {
        const requestIndex = user.apartment.profile.requests.findIndex(
            (request) => request._id === joinRequest._id,
        );
        if (requestIndex !== -1) {
            user.apartment.profile.requests.splice(requestIndex, 1);
            setUser({ ...user });
            setError('The request to join your apartment was deleted');
        }
    };

    const content = joinRequests.map((joinRequest) => (
        <ProfileJoinRequestCell
            joinRequest={joinRequest}
            handleAccept={handleAccept}
            handleDelete={handleDelete}
        />
    ));

    return (
        <div>
            {error.length === 0 ? null : <p style={{ color: 'red' }}>{error}</p>}
            {content.length === 0 ? (
                <DescriptionCell content={'No users have requested to join your apartment.'} />
            ) : (
                content
            )}
        </div>
    );
};

const ProfileCodeCell: React.FC = () => {
    const { matesUser: user } = useContext(MatesUserContext) as MatesUserContextType;
    const code = user.apartment.profile.code;
    return (
        <div>
            <DescriptionCell
                content={
                    "This is your apartment's unique code. Other users can use this code to request to join your apartment, and other apartments can use this code to request to add your apartment as a friend."
                }
            />
            <h1 style={{ color: 'dodgerblue', fontSize: 72, textAlign: 'center' }}>{code}</h1>
        </div>
    );
};

export default DemoProfile;
