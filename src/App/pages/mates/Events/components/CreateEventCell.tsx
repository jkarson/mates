import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import DateTimeInputCell from '../../../../common/components/DateTimeInputCell';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { Tenant } from '../../../../common/models';
import { DateTimeInputType } from '../../../../common/types';
import {
    getCurrentDateTime,
    getTenant,
    convertToDateWithTime,
    getPostOptions,
    getApartmentSummaryString,
    getNullEvent,
} from '../../../../common/utilities';
import { ApartmentEvent, ApartmentEventWithoutId } from '../models/EventsInfo';
import { EventsTabType } from '../models/EventsTabs';
import { initializeServerEventsInfo, isPastEvent, isPresentEvent } from '../utilities';

import '../styles/CreateEventCell.css';
import {
    FauxSimpleButton,
    BiggerFauxSimpleButton,
} from '../../../../common/components/FauxSimpleButtons';
import { FriendProfile } from '../../Friends/models/FriendsInfo';
import InviteInviteeAttendeeModal from './InviteInviteeAttendeeModal';
import { BiggerSimpleButton, SimpleButton } from '../../../../common/components/SimpleButtons';
import { RedMessageCell } from '../../../../common/components/ColoredMessageCells';
import { StyledInput } from '../../../../common/components/StyledInputs';

interface CreateEventInputType {
    title: string;
    description: string;
    time: DateTimeInputType;
}

interface CreateEventCellProps {
    setTab: React.Dispatch<React.SetStateAction<EventsTabType>>;
}

const CreateEventCell: React.FC<CreateEventCellProps> = ({ setTab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const initialInput: CreateEventInputType = {
        title: '',
        description: '',
        time: getCurrentDateTime(),
    };
    const [input, setInput] = useState<CreateEventInputType>(initialInput);
    const [invited, setInvited] = useState<FriendProfile[]>([]);
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');
    const [showInviteFriendsModal, setShowInviteFriendsModal] = useState(false);
    const [showInviteesModal, setShowInviteesModal] = useState(false);
    const [serverCallMade, setServerCallMade] = useState(false);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        const name = event.target.name;
        const value = event.target.value;
        if (value === ' ') {
            return;
        }
        setInput({ ...input, [name]: event.target.value.trimStart() });
    };

    const setDateTimeState = (time: DateTimeInputType) => {
        setInput({ ...input, time: time });
    };

    const hasFriendsToInvite = () =>
        user.apartment.friendsInfo.friends.filter((friend) => !invited.includes(friend)).length > 0;

    const hasInvitedFriends = () => invited.length > 0;

    const canCreate = () => input.title.length > 0;

    const handleCreateEvent = () => {
        if (canCreate()) {
            if (serverCallMade) {
                return;
            }
            setServerCallMade(true);
            const tenant = getTenant(user) as Tenant;

            input.title = input.title.trim();
            input.description = input.description.trim();

            const newEvent: ApartmentEventWithoutId = {
                creator: getApartmentSummaryString(user.apartment),
                creatorId: tenant.userId,
                time: convertToDateWithTime(input.time),
                hostApartmentId: user.apartment._id,
                invitees: [],
                attendees: [],
                title: input.title,
                description: input.description,
            };

            const data = {
                apartmentId: user.apartment._id,
                newEvent: newEvent,
                inviteeIds: invited.map((invitee) => invitee.apartmentId),
            };
            const options = getPostOptions(data);
            fetch('/mates/createEvent', options)
                .then((res) => res.json())
                .then((json) => {
                    setServerCallMade(false);
                    const { authenticated, success } = json;
                    if (!authenticated) {
                        setRedirect(true);
                        return;
                    }
                    if (!success) {
                        setError('Sorry, the event could not be created at this time');
                        return;
                    }
                    const { eventsInfo, newEventId } = json;
                    const formattedEventsInfo = initializeServerEventsInfo(eventsInfo);
                    const formattedNewEvent = formattedEventsInfo.events.find(
                        (event) => event._id.toString() === newEventId.toString(),
                    ) as ApartmentEvent;
                    setUser({
                        ...user,
                        apartment: { ...user.apartment, eventsInfo: formattedEventsInfo },
                    });
                    setError('');
                    setInput(initialInput);

                    let newTab: EventsTabType;
                    if (isPastEvent(formattedNewEvent)) {
                        newTab = 'Past';
                    } else if (isPresentEvent(formattedNewEvent)) {
                        newTab = 'Present';
                    } else {
                        newTab = 'Future';
                    }
                    setTab(newTab);
                })
                .catch(() => setError('Sorry, our server seems to be down.'));
        }
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div className="create-event-cell-container">
            {showInviteFriendsModal ? (
                <InviteInviteeAttendeeModal
                    event={getNullEvent()}
                    canRemove={true}
                    handleInvite={() => null}
                    handleUninvite={() => null}
                    handleRemoveAttendee={() => null}
                    setShow={setShowInviteFriendsModal}
                    createInvited={invited}
                    setCreateInvited={setInvited}
                    mode="CreateInvite"
                />
            ) : null}
            {showInviteesModal ? (
                <InviteInviteeAttendeeModal
                    event={getNullEvent()}
                    canRemove={true}
                    handleInvite={() => null}
                    handleUninvite={() => null}
                    handleRemoveAttendee={() => null}
                    setShow={setShowInviteesModal}
                    createInvited={invited}
                    setCreateInvited={setInvited}
                    mode="CreateInvitees"
                />
            ) : null}
            <div className="create-event-cell-input-container">
                <StyledInput
                    type="text"
                    name="title"
                    placeholder={'* Event name'}
                    value={input.title}
                    onChange={handleChange}
                />
                <div className="create-event-cell-date-time-container">
                    <DateTimeInputCell state={input.time} setState={setDateTimeState} />
                </div>
                <textarea
                    name="description"
                    placeholder="Description"
                    value={input.description}
                    onChange={handleChange}
                    rows={5}
                />
                <div className="create-event-cell-friends-buttons-container">
                    {hasFriendsToInvite() ? (
                        <SimpleButton
                            text="Invite Friends"
                            onClick={() => setShowInviteFriendsModal(true)}
                        />
                    ) : (
                        <FauxSimpleButton text="Invite Friends" />
                    )}
                    {hasInvitedFriends() ? (
                        <SimpleButton
                            text="View Invited"
                            onClick={() => setShowInviteesModal(true)}
                        />
                    ) : (
                        <FauxSimpleButton text="View Invited" />
                    )}
                </div>
            </div>
            <div className="create-event-cell-button-container">
                {canCreate() ? (
                    <BiggerSimpleButton onClick={handleCreateEvent} text="Create Event" />
                ) : (
                    <BiggerFauxSimpleButton text="Create Event" />
                )}
            </div>
            {error.length === 0 ? null : (
                <div className="create-event-cell-error-container">
                    <RedMessageCell message={error} />
                </div>
            )}
        </div>
    );
};

export default CreateEventCell;
