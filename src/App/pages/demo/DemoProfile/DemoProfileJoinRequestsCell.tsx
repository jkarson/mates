import React, { useContext, useState } from 'react';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import LastWordBoldTextCell from '../../../common/components/LastWordBoldTextCell';
import StandardStyledText from '../../../common/components/StandardStyledText';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import ProfileJoinRequestCell from '../../mates/Profile/components/ProfileJoinRequestCell';
import { JoinRequest } from '../../mates/Profile/models/ProfileInfo';
import { ProfileTabType } from '../../mates/Profile/models/ProfileTabs';

interface DemoProfileJoinRequestsCellProps {
    setTab: React.Dispatch<React.SetStateAction<ProfileTabType>>;
}

const DemoProfileJoinRequestsCell: React.FC<DemoProfileJoinRequestsCellProps> = ({ setTab }) => {
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
        setError('');
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
            setError('Join request deleted.');
        }
    };

    const content = joinRequests.map((joinRequest) => (
        <ProfileJoinRequestCell
            joinRequest={joinRequest}
            handleAccept={handleAccept}
            handleDelete={handleDelete}
            key={joinRequest._id}
        />
    ));

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

export default DemoProfileJoinRequestsCell;
