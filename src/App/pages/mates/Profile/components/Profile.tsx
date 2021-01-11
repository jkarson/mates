import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import DescriptionCell from '../../../../common/components/DescriptionCell';
import Tabs from '../../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { JoinRequest, Tenant, UserId } from '../../../../common/models';
import {
    assertUnreachable,
    getDeleteOptions,
    getFriendProfileFromApartment,
    getPostOptions,
} from '../../../../common/utilities';
import { profileTabNames, ProfileTabType } from '../models/ProfileTabs';
import ApartmentProfileCellBody from './ApartmentProfileCellBody';
import ApartmentProfileModificationCell from './ApartmentProfileModificationCell';
import TenantProfileCellBody from './TenantProfileCellBody';
import TenantProfileModificationCell from './TenantProfileModificationCell';

//EXTENSION: Could incorporate birthdays, calculate age automatically,
//send a notification, make it pretty, etc

//EXTENSION: add photo to apartment profile

//EXTENSION: Make profiles more customizable, perhaps text colors and perhaps individual-level
// photos

//EXTENSION: Quotes for individuals

// TO DO: Use Create Apartment Cell's "UpdateChangeAge" (may want to move to common comp)

// TO DO: further modularize this file most likely

//TO DO: Account page ==> be able to cancel join apartment request, be able to leave apartment, etc

const Profile: React.FC = () => {
    const { matesUser: user } = useContext(MatesUserContext) as MatesUserContextType;
    const [tab, setTab] = useState<ProfileTabType>('Your Profile');

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

const ModifiableApartmentProfile: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;
    const [edit, setEdit] = useState(false);
    const [input, setInput] = useState(user.apartment.profile);
    const [redirect, setRedirect] = useState(false);
    const [updateProfileError, setUpdateProfileError] = useState(false);

    const handleChange = () => {
        if (edit) {
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: input.name,
                    address: input.address,
                    quote: input.quote,
                    apartmentId: user.apartment._id,
                }),
            };
            fetch('/mates/updateApartmentProfile', options)
                .then((response) => response.json())
                .then((json) => {
                    const { authenticated, success } = json;
                    if (!authenticated) {
                        setRedirect(true);
                        return;
                    }
                    if (!success) {
                        setUpdateProfileError(true);
                        return;
                    }
                    const { newProfile } = json;
                    setEdit(false);
                    setUser({ ...user, apartment: { ...user.apartment, profile: newProfile } });
                });
        } else {
            setEdit(true);
        }
    };
    if (redirect) {
        return <Redirect to="/" />;
    }
    return (
        <div>
            {!edit ? (
                <ApartmentProfileCellBody
                    apartment={getFriendProfileFromApartment(user.apartment)}
                />
            ) : (
                <ApartmentProfileModificationCell state={input} setState={setInput} />
            )}
            <button onClick={handleChange}>{edit ? 'Save' : 'Edit'}</button>
            {!updateProfileError ? null : (
                <p style={{ color: 'red' }}>{'Your profile could not be saved'}</p>
            )}
        </div>
    );
};

interface TenantsProfileCellProps {
    tenants: Tenant[];
    includesUser: boolean;
    userId?: UserId;
}

export const TenantsProfileCell: React.FC<TenantsProfileCellProps> = ({
    tenants,
    includesUser,
    userId,
}) => {
    tenants.sort((a, b) => (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1));
    return (
        <div>
            {tenants.map((tenant: Tenant) => {
                if (includesUser && userId === tenant.userId) {
                    return <TenantProfileModificationCell key={tenant.userId} />;
                } else {
                    return <TenantProfileCellBody tenant={tenant} key={tenant.userId} />;
                }
            })}
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
                });
            });
    };

    const content = joinRequests.map((joinRequest) => (
        <JoinRequestCell
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

interface JoinRequestCellProps {
    joinRequest: JoinRequest;
    handleAccept: (joinRequest: JoinRequest) => void;
    handleDelete: (joinRequest: JoinRequest) => void;
}

const JoinRequestCell: React.FC<JoinRequestCellProps> = ({
    joinRequest,
    handleAccept,
    handleDelete,
}) => (
    <div style={{ borderBottom: '1px solid black' }}>
        <h3>{joinRequest.username}</h3>
        <button onClick={() => handleAccept(joinRequest)}>{'Add to apartment'}</button>
        <button onClick={() => handleDelete(joinRequest)}>{'Delete Request '}</button>
    </div>
);

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
