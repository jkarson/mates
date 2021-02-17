import React, { useState } from 'react';
import { ApartmentId } from '../../../../common/models';
import { getFormattedDateTimeString } from '../../../../common/utilities';
import { ApartmentEvent } from '../models/EventsInfo';
import { isFutureEvent, isPresentEvent } from '../utilities';
import InviteInviteeAttendeeModal from './InviteInviteeAttendeeModal';
import { FauxSimpleButton } from '../../../../common/components/FauxSimpleButtons';
import YesNoMessageModal from '../../../../common/components/YesNoMessageModal';
import { SimpleButton } from '../../../../common/components/SimpleButtons';

import '../styles/EventCell.css';

interface EventCellProps {
    event: ApartmentEvent;
    hosting: boolean;
    canRemoveEvent: boolean;
    canRemoveFromEvent: boolean;
    areApartmentsToInvite: boolean;
    handleRemoveEvent: (event: ApartmentEvent) => void;
    handleInvite: (event: ApartmentEvent, invitee: ApartmentId) => void;
    handleRemoveInvitee: (event: ApartmentEvent, invitee: ApartmentId) => void;
    handleRemoveAttendee: (event: ApartmentEvent, attendee: ApartmentId) => void;
    handleLeaveEvent: (event: ApartmentEvent) => void;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const EventCell: React.FC<EventCellProps> = ({
    event,
    hosting,
    canRemoveEvent,
    canRemoveFromEvent,
    areApartmentsToInvite,
    handleRemoveEvent,
    handleInvite,
    handleRemoveInvitee,
    handleRemoveAttendee,
    handleLeaveEvent,
    setMessage,
}) => {
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showInviteesModal, setShowInviteesModal] = useState(false);
    const [showAttendeesModal, setShowAttendeesModal] = useState(false);
    const [showLeaveEventModal, setShowLeaveEventModal] = useState(false);
    const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);

    const presentOrFuture = isFutureEvent(event) || isPresentEvent(event);

    return (
        <div className="event-cell-container">
            {showInviteModal ? (
                <InviteInviteeAttendeeModal
                    event={event}
                    canRemove={canRemoveFromEvent}
                    handleInvite={handleInvite}
                    handleUninvite={handleRemoveInvitee}
                    handleRemoveAttendee={handleRemoveAttendee}
                    setShow={setShowInviteModal}
                    mode="Invite"
                    createInvited={[]}
                />
            ) : null}
            {showInviteesModal ? (
                <InviteInviteeAttendeeModal
                    event={event}
                    canRemove={canRemoveFromEvent}
                    handleInvite={handleInvite}
                    handleUninvite={handleRemoveInvitee}
                    handleRemoveAttendee={handleRemoveAttendee}
                    setShow={setShowInviteesModal}
                    mode="Invitees"
                    createInvited={[]}
                />
            ) : null}
            {showAttendeesModal ? (
                <InviteInviteeAttendeeModal
                    event={event}
                    canRemove={canRemoveFromEvent}
                    handleInvite={handleInvite}
                    handleUninvite={handleRemoveInvitee}
                    handleRemoveAttendee={handleRemoveAttendee}
                    setShow={setShowAttendeesModal}
                    mode="Attendees"
                    createInvited={[]}
                />
            ) : null}
            <YesNoMessageModal
                show={showLeaveEventModal}
                setShow={setShowLeaveEventModal}
                message={'Are you sure you want your apartment to leave this event?'}
                yesText={'Leave Event'}
                onClickYes={() => handleLeaveEvent(event)}
            />
            <YesNoMessageModal
                show={showDeleteEventModal}
                setShow={setShowDeleteEventModal}
                message={'Are you sure you want to permanently delete this event?'}
                yesText={'Delete Event'}
                onClickYes={() => handleRemoveEvent(event)}
            />
            <div className="event-cell-inner-container">
                <div className="event-cell-delete-button-container">
                    {canRemoveEvent ? (
                        <SimpleButton
                            onClick={() => setShowDeleteEventModal(true)}
                            text={'Delete Event'}
                        />
                    ) : null}
                </div>
                <div className="event-cell-leave-event-button-container">
                    {!hosting ? (
                        <SimpleButton
                            onClick={() => setShowLeaveEventModal(true)}
                            text={'Leave Event'}
                        />
                    ) : null}
                </div>
                <div className="event-cell-event-info-container">
                    <div className="event-cell-event-title-container">
                        <span>{event.title}</span>
                    </div>
                    <div className="event-cell-event-date-container">
                        <span>{getFormattedDateTimeString(event.time)}</span>
                    </div>
                    <div className="event-cell-event-created-by-container">
                        <span>{'Hosted by '}</span>
                        <i className="fa fa-home" />
                        <span>{event.creator}</span>
                    </div>
                    {event.description ? (
                        <div className="event-cell-event-description-container">
                            <span>{event.description}</span>
                        </div>
                    ) : null}
                </div>
                <div className="event-cell-buttons-container">
                    {presentOrFuture && hosting ? (
                        areApartmentsToInvite ? (
                            <SimpleButton
                                onClick={() => {
                                    setShowInviteModal(true);
                                    setMessage('');
                                }}
                                text={'Invite Friends'}
                            />
                        ) : (
                            <FauxSimpleButton text="Invite Friends" />
                        )
                    ) : null}
                    {event.invitees.length === 0 ? (
                        <FauxSimpleButton text="View Invitees" />
                    ) : (
                        <SimpleButton
                            onClick={() => {
                                setShowInviteesModal(true);
                                setMessage('');
                            }}
                            text="View Invitees"
                        />
                    )}
                    {event.attendees.length === 0 ? (
                        <FauxSimpleButton text="View Attendees" />
                    ) : (
                        <SimpleButton
                            onClick={() => {
                                setShowAttendeesModal(true);
                                setMessage('');
                            }}
                            text="View Attendees"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCell;
