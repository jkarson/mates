import React, { useContext, useEffect } from 'react';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { ApartmentId } from '../../../../common/models';
import { ApartmentEvent } from '../models/EventsInfo';
import EligibleInviteeCell from './EligibleInviteeCell';

import '../styles/InviteInviteeAttendeeModal.css';
import {
    assertUnreachable,
    getApartmentSummaryFromFriendProfile,
} from '../../../../common/utilities';
import { FriendProfile } from '../../Friends/models/FriendsInfo';

interface InviteInviteeAttendeeModalProps {
    event: ApartmentEvent;
    canRemove: boolean;
    handleInvite: (event: ApartmentEvent, invitee: ApartmentId) => void;
    handleUninvite: (event: ApartmentEvent, invitee: ApartmentId) => void;
    handleRemoveAttendee: (event: ApartmentEvent, attendee: ApartmentId) => void;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    createInvited: FriendProfile[];
    setCreateInvited?: React.Dispatch<React.SetStateAction<FriendProfile[]>>;
    mode: 'Invite' | 'Invitees' | 'Attendees' | 'CreateInvite' | 'CreateInvitees';
}

const InviteInviteeAttendeeModal: React.FC<InviteInviteeAttendeeModalProps> = ({
    event,
    canRemove,
    handleInvite,
    handleUninvite,
    handleRemoveAttendee,
    setShow,
    createInvited,
    setCreateInvited,
    mode,
}) => {
    const { matesUser } = useContext(MatesUserContext) as MatesUserContextType;
    const friends = matesUser.apartment.friendsInfo.friends;
    let inviteInviteeAttendeeCells: JSX.Element[];
    switch (mode) {
        case 'Invite':
            const eligibleInvitees = friends.filter((apartment) => {
                const apartmentId = apartment.apartmentId;
                const attendeeIds = event.attendees.map((attendee) => attendee.apartmentId);
                const inviteeIds = event.invitees.map((invitee) => invitee.apartmentId);
                return !attendeeIds.includes(apartmentId) && !inviteeIds.includes(apartmentId);
            });
            inviteInviteeAttendeeCells = eligibleInvitees.map((apartment) => (
                <EligibleInviteeCell
                    apartment={getApartmentSummaryFromFriendProfile(apartment)}
                    handleClickInvite={() => handleInvite(event, apartment.apartmentId)}
                    handleClickUninvite={() => null}
                    handleClickRemoveAttendee={() => null}
                    canRemove={canRemove}
                    mode="Invite"
                    key={apartment.apartmentId}
                />
            ));
            break;
        case 'Invitees':
            inviteInviteeAttendeeCells = event.invitees.map((apartment) => (
                <EligibleInviteeCell
                    apartment={apartment}
                    handleClickInvite={() => null}
                    handleClickUninvite={() => handleUninvite(event, apartment.apartmentId)}
                    handleClickRemoveAttendee={() => null}
                    canRemove={canRemove}
                    mode="Invitees"
                    key={apartment.apartmentId}
                />
            ));
            break;
        case 'Attendees':
            inviteInviteeAttendeeCells = event.attendees.map((apartment) => (
                <EligibleInviteeCell
                    apartment={apartment}
                    handleClickInvite={() => null}
                    handleClickUninvite={() => null}
                    handleClickRemoveAttendee={() =>
                        handleRemoveAttendee(event, apartment.apartmentId)
                    }
                    canRemove={canRemove}
                    mode="Attendees"
                    key={apartment.apartmentId}
                />
            ));
            break;
        case 'CreateInvite':
            const eligibleInviteesCreate = friends.filter((apartment) => {
                const apartmentId = apartment.apartmentId;
                const inviteeIds = createInvited.map((invitee) => invitee.apartmentId);
                return !inviteeIds.includes(apartmentId);
            });
            inviteInviteeAttendeeCells = eligibleInviteesCreate.map((apartment) => (
                <EligibleInviteeCell
                    apartment={getApartmentSummaryFromFriendProfile(apartment)}
                    handleClickInvite={() => {
                        createInvited.push(apartment);
                        if (setCreateInvited) {
                            setCreateInvited([...createInvited]);
                        }
                    }}
                    handleClickUninvite={() => null}
                    handleClickRemoveAttendee={() => null}
                    canRemove={canRemove}
                    mode="Invite"
                    key={apartment.apartmentId}
                />
            ));
            break;
        case 'CreateInvitees':
            inviteInviteeAttendeeCells = createInvited.map((apartment) => (
                <EligibleInviteeCell
                    apartment={getApartmentSummaryFromFriendProfile(apartment)}
                    handleClickInvite={() => null}
                    handleClickUninvite={() => {
                        const index = createInvited.indexOf(apartment);
                        createInvited.splice(index, 1);
                        if (setCreateInvited) {
                            setCreateInvited([...createInvited]);
                        }
                    }}
                    handleClickRemoveAttendee={() => null}
                    canRemove={canRemove}
                    mode="Invitees"
                    key={apartment.apartmentId}
                />
            ));
            break;
        default:
            assertUnreachable(mode);
    }

    useEffect(() => {
        if (inviteInviteeAttendeeCells.length === 0) {
            setShow(false);
        }
    }, [inviteInviteeAttendeeCells.length, setShow]);

    return (
        <div className="send-invitation-cell-modal-container">
            <div className="send-invitation-cell-modal-empty-top" onClick={() => setShow(false)} />
            <div className="send-invitation-cell-modal-empty-left" onClick={() => setShow(false)} />
            <div
                className="send-invitation-cell-modal-empty-right"
                onClick={() => setShow(false)}
            />
            <div
                className="send-invitation-cell-modal-empty-bottom"
                onClick={() => setShow(false)}
            />
            <div className="send-invitation-cell-modal-content-container">
                {inviteInviteeAttendeeCells}
            </div>
            <div
                className="send-invitation-cell-modal-icon-close-container"
                onClick={() => setShow(false)}
            >
                <i className="fa fa-times-circle" />
            </div>
        </div>
    );
};

export default InviteInviteeAttendeeModal;
