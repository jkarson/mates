import React, { useContext, useLayoutEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import DescriptionCell from '../../../../common/components/DescriptionCell';
import Tabs from '../../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { assertUnreachable, getDeleteOptions, getPostOptions } from '../../../../common/utilities';
import { JoinRequest } from '../models/ProfileInfo';
import { profileTabNames, ProfileTabType } from '../models/ProfileTabs';

import ModifiableApartmentProfile from './ModifiableApartmentProfile';
import ProfileJoinRequestCell from './ProfileJoinRequestCell';
import { TenantsProfileCell } from './TenantsProfileCell';

//EXTENSION: Could incorporate birthdays, calculate age automatically,
//send a notification, make it pretty, etc

//EXTENSION: add photo to apartment profile

//EXTENSION: Make profiles more customizable, perhaps text colors and perhaps individual-level
// photos

//EXTENSION: Quotes for individuals

const Profile: React.FC = () => {
    const { matesUser: user } = useContext(MatesUserContext) as MatesUserContextType;
    const [tab, setTab] = useState<ProfileTabType>('Your Profile');
    useLayoutEffect(() => {
        if (user.apartment.profile.requests.length > 0) {
            setTab('Join Requests');
        }
    }, []);

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
            <ModifiableApartmentProfile />
            <TenantsProfileCell
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

    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');

    const handleAccept = (joinRequest: JoinRequest) => {
        const data = { apartmentId: user.apartment._id, joineeId: joinRequest._id };
        const options = getPostOptions(data);
        fetch('/mates/acceptJoinRequest', options)
            .then((response) => response.json())
            .then((json) => {
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setError('Sorry, this user could not be added to your apartment');
                    return;
                }
                const { resultTenants, resultRequests } = json;
                setUser({
                    ...user,
                    apartment: {
                        ...user.apartment,
                        tenants: resultTenants,
                        profile: { ...user.apartment.profile, requests: resultRequests },
                    },
                });
                setTab('Your Profile');
            });
    };

    const handleDelete = (joinRequest: JoinRequest) => {
        const data = { apartmentId: user.apartment._id, requesteeId: joinRequest._id };
        const options = getDeleteOptions(data);
        fetch('/mates/deleteJoinRequest', options)
            .then((response) => response.json())
            .then((json) => {
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setError('Sorry, the request could not be deleted.');
                    return;
                }
                const { requests } = json;
                setUser({
                    ...user,
                    apartment: {
                        ...user.apartment,
                        profile: { ...user.apartment.profile, requests: requests },
                    },
                }); //to do: add message?
            });
    };

    const content = joinRequests.map((joinRequest) => (
        <ProfileJoinRequestCell
            joinRequest={joinRequest}
            handleAccept={handleAccept}
            handleDelete={handleDelete}
        />
    ));

    if (redirect) {
        return <Redirect to="/" />;
    }
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

export default Profile;
