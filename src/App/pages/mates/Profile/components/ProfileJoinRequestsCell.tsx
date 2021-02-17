import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { getPostOptions, getDeleteOptions } from '../../../../common/utilities';
import { JoinRequest } from '../models/ProfileInfo';
import { ProfileTabType } from '../models/ProfileTabs';
import ProfileJoinRequestCell from './ProfileJoinRequestCell';
import LastWordBoldTextCell from '../../../../common/components/LastWordBoldTextCell';
import StandardStyledText from '../../../../common/components/StandardStyledText';
import { RedMessageCell } from '../../../../common/components/ColoredMessageCells';

import '../styles/ProfileJoinRequestsCell.css';

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
    const [serverCallMade, setServerCallMade] = useState(false);

    const handleAccept = (joinRequest: JoinRequest) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const data = { apartmentId: user.apartment._id, joineeId: joinRequest._id };
        const options = getPostOptions(data);
        fetch('/mates/acceptJoinRequest', options)
            .then((response) => response.json())
            .then((json) => {
                setServerCallMade(false);
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
                setError('');
                setUser({
                    ...user,
                    apartment: {
                        ...user.apartment,
                        tenants: resultTenants,
                        profile: { ...user.apartment.profile, requests: resultRequests },
                    },
                });
                setTab('Your Profile');
            })
            .catch(() => setError('Sorry, our server seems to be down.'));
    };

    const handleDelete = (joinRequest: JoinRequest) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const data = { apartmentId: user.apartment._id, requesteeId: joinRequest._id };
        const options = getDeleteOptions(data);
        fetch('/mates/deleteJoinRequest', options)
            .then((response) => response.json())
            .then((json) => {
                setServerCallMade(true);
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
                setError('Join request deleted');
            })
            .catch(() => setError('Sorry, our server seems to be down.'));
    };

    const content = joinRequests.map((joinRequest) => (
        <ProfileJoinRequestCell
            joinRequest={joinRequest}
            handleAccept={handleAccept}
            handleDelete={handleDelete}
            key={joinRequest._id}
        />
    ));

    if (redirect) {
        return <Redirect to="/" />;
    }
    return (
        <div className="profile-join-requests-cell-container">
            <div className="profile-join-requests-cell-description-container">
                {content.length === 0 ? (
                    <StandardStyledText text={'No users have requested to join your apartment.'} />
                ) : (
                    <StandardStyledText
                        text={'A list of users who have requested to join your apartment.'}
                    />
                )}
            </div>
            {error.length === 0 ? null : (
                <div className="profile-join-requests-cell-error-container">
                    <RedMessageCell message={error} />{' '}
                </div>
            )}
            <div className="profile-join-requests-cell-content-container">
                <div className="profile-join-requests-cell-content-container-inner">
                    <div className="profile-join-requests-cell-code-description-container">
                        <LastWordBoldTextCell
                            mainText={
                                'Users can request to join your apartment using your unique code: '
                            }
                            lastWord={user.apartment.profile.code}
                        />
                    </div>
                    <div>{content}</div>
                </div>
            </div>
        </div>
    );
};

export default ProfileJoinRequestsCell;
