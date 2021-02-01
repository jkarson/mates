import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import RedMessageCell from '../../../common/components/RedMessageCell';
import StandardStyledText from '../../../common/components/StandardStyledText';
import { AccountContext } from '../../../common/context';
import { getPostOptions } from '../../../common/utilities';
import { ApartmentSummary } from '../../mates/Friends/models/FriendsInfo';
import AccountJoinRequestCell from './AccountJoinRequestCell';

import '../styles/JoinRequestsCell.css';

const JoinRequestsCell: React.FC = () => {
    const userContext = useContext(AccountContext);
    const [redirect, setRedirect] = useState(false);
    const [message, setMessage] = useState('');
    if (!userContext) {
        return null;
    }

    const { user, setUser } = userContext;
    const requestedApartmentSummaries: ApartmentSummary[] = user.requestedApartments;

    const cancelJoinRequest = (requestedApartment: ApartmentSummary) => {
        const data = {
            userId: user._id,
            requestedApartmentId: requestedApartment.apartmentId,
        };
        const options = getPostOptions(data);
        fetch('/account/cancelJoinRequest', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, your join request could not be cancelled at this time');
                    return;
                }
                const { user } = json;
                setUser({ ...user });
                setMessage('Join Request Cancelled');
            });
    };

    const content = requestedApartmentSummaries.map((apartmentSummary) => (
        <AccountJoinRequestCell
            apartmentSummary={apartmentSummary}
            cancelJoinRequest={cancelJoinRequest}
        />
    ));

    if (redirect) {
        return <Redirect to="/" />;
    }
    return (
        <div className="join-requests-cell-container">
            <div className="join-requests-cell-header-container">
                <StandardStyledText
                    text={
                        requestedApartmentSummaries.length === 0
                            ? 'Apartments that you have requested to join will appear hear.'
                            : 'Apartments you have requested to join.'
                    }
                />
                <div className="join-requests-cell-message-container">
                    {message.length === 0 ? null : <RedMessageCell message={message} />}
                </div>
            </div>
            <div className="join-requests-cell-content-container">{content}</div>
        </div>
    );
};

export default JoinRequestsCell;
