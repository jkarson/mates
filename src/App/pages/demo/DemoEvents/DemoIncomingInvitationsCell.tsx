import React, { useContext, useState } from 'react';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import StandardStyledText from '../../../common/components/StandardStyledText';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import InvitationCell from '../../mates/Events/components/InvitationCell';
import { ApartmentEvent } from '../../mates/Events/models/EventsInfo';
import { EventsTabType } from '../../mates/Events/models/EventsTabs';
import { isPastEvent, isPresentEvent } from '../../mates/Events/utilities';

interface DemoIncomingInvitationsCellProps {
    setTab: React.Dispatch<React.SetStateAction<EventsTabType>>;
}

const DemoIncomingInvitationsCell: React.FC<DemoIncomingInvitationsCellProps> = ({ setTab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [message, setMessage] = useState('');

    const invitations = user.apartment.eventsInfo.invitations;

    const handleAcceptInvitation = (invitation: ApartmentEvent) => {
        const apartmentIndex = invitation.invitees.findIndex(
            (invitee) => invitee.apartmentId === user.apartment._id,
        );
        if (apartmentIndex !== -1) {
            invitation.invitees.splice(apartmentIndex, 1);
        }
        invitation.attendees.push({
            apartmentId: user.apartment._id,
            name: user.apartment.profile.name,
            tenantNames: user.apartment.tenants.map((tenant) => tenant.name),
        });

        const invitationIndex = user.apartment.eventsInfo.invitations.findIndex(
            (event) => event._id === invitation._id,
        );
        if (invitationIndex !== -1) {
            user.apartment.eventsInfo.invitations.splice(invitationIndex, 1);
        }
        user.apartment.eventsInfo.events.push(invitation);
        setUser({ ...user });
        if (isPastEvent(invitation)) {
            setTab('Past');
        } else if (isPresentEvent(invitation)) {
            setTab('Present');
        } else {
            setTab('Future');
        }
    };

    const handleRejectInvitation = (invitation: ApartmentEvent) => {
        const apartmentIndex = invitation.invitees.findIndex(
            (invitee) => invitee.apartmentId === user.apartment._id,
        );
        if (apartmentIndex !== -1) {
            invitation.invitees.splice(apartmentIndex, 1);
        }
        const invitationIndex = user.apartment.eventsInfo.invitations.findIndex(
            (userInvitation) => userInvitation._id === invitation._id,
        );
        if (invitationIndex !== -1) {
            user.apartment.eventsInfo.invitations.splice(invitationIndex, 1);
        }
        setUser({ ...user });
        setMessage('Event invitation rejected.');
    };

    const content = invitations.map((invitation) => (
        <InvitationCell
            invitation={invitation}
            handleAccept={handleAcceptInvitation}
            handleDelete={handleRejectInvitation}
            key={invitation._id}
        />
    ));

    return (
        <div className="incoming-invitations-cell-container">
            {invitations.length === 0 ? (
                <div className="incoming-invitations-cell-message-container">
                    <StandardStyledText text={'You have not been invited to any events.'} />
                </div>
            ) : null}
            <div className="incoming-invitations-cell-error-container">
                {message.length === 0 ? null : <RedMessageCell message={message} />}
            </div>
            <div className="incoming-invitations-cell-content-container">{content}</div>
        </div>
    );
};

export default DemoIncomingInvitationsCell;
