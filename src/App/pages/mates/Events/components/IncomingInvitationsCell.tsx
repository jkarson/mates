import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import RedMessageCell from '../../../../common/components/RedMessageCell';
import StandardStyledText from '../../../../common/components/StandardStyledText';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { getPutOptions } from '../../../../common/utilities';
import { ApartmentEvent } from '../models/EventsInfo';
import { EventsTabType } from '../models/EventsTabs';
import { initializeServerEventsInfo, isPastEvent, isPresentEvent } from '../utilities';
import InvitationCell from './InvitationCell';

import '../styles/IncomingInvitationsCell.css';

interface IncomingInvitationsCellProps {
    setTab: React.Dispatch<React.SetStateAction<EventsTabType>>;
}

const IncomingInvitationsCell: React.FC<IncomingInvitationsCellProps> = ({ setTab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [redirect, setRedirect] = useState(false);
    const [message, setMessage] = useState('');

    const invitations = user.apartment.eventsInfo.invitations;

    const handleAcceptInvitation = (invitation: ApartmentEvent) => {
        const data = { apartmentId: user.apartment._id, eventId: invitation._id };
        const options = getPutOptions(data);
        fetch('/mates/acceptEventInvitation', options).then((res) =>
            res.json().then((json) => {
                console.log(json);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, the invitation can not be accepted at this time');
                    return;
                }
                const { eventsInfo } = json;
                const formattedEventsInfo = initializeServerEventsInfo(eventsInfo);
                //TO DO: This doesn't seem like the best way to do this, the server should explicitly
                //return the new event.
                const newEvent = formattedEventsInfo.events[formattedEventsInfo.events.length - 1];
                setUser({
                    ...user,
                    apartment: { ...user.apartment, eventsInfo: formattedEventsInfo },
                });
                if (isPastEvent(newEvent)) {
                    setTab('Past');
                } else if (isPresentEvent(newEvent)) {
                    setTab('Present');
                } else {
                    setTab('Future');
                }
            }),
        );
    };

    const handleRejectInvitation = (invitation: ApartmentEvent) => {
        const data = {
            apartmentId: user.apartment._id,
            eventId: invitation._id,
        };
        const options = getPutOptions(data);
        fetch('/mates/rejectEventInvitation', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, the event invitation could not be rejected at this time');
                    return;
                }
                const { eventsInfo } = json;
                const formattedEventsInfo = initializeServerEventsInfo(eventsInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, eventsInfo: formattedEventsInfo },
                });
                setMessage('Event invitation rejected');
            });
    };

    const content = invitations.map((invitation) => (
        <InvitationCell
            invitation={invitation}
            handleAccept={handleAcceptInvitation}
            handleDelete={handleRejectInvitation}
        />
    ));

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div className="incoming-invitations-cell-container">
            <div className="incoming-invitations-cell-error-container">
                {message.length === 0 ? null : <RedMessageCell message={message} />}
            </div>
            <div className="incoming-invitations-cell-message-container">
                {invitations.length === 0 ? (
                    <StandardStyledText text={'You have not been invited to any events.'} />
                ) : null}
            </div>
            <div className="incoming-invitations-cell-content-container">{content}</div>
        </div>
    );
};

export default IncomingInvitationsCell;
