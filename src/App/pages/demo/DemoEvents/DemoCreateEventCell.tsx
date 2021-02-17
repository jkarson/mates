import React, { useContext, useState } from 'react';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import DateTimeInputCell from '../../../common/components/DateTimeInputCell';
import {
    FauxSimpleButton,
    BiggerFauxSimpleButton,
} from '../../../common/components/FauxSimpleButtons';
import { SimpleButton, BiggerSimpleButton } from '../../../common/components/SimpleButtons';
import { StyledInput } from '../../../common/components/StyledInputs';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { Tenant } from '../../../common/models';
import { DateTimeInputType } from '../../../common/types';
import {
    getCurrentDateTime,
    getTenant,
    convertToDateWithTime,
    getApartmentSummaryFromFriendProfile,
    getNullEvent,
} from '../../../common/utilities';
import InviteInviteeAttendeeModal from '../../mates/Events/components/InviteInviteeAttendeeModal';
import { ApartmentEvent } from '../../mates/Events/models/EventsInfo';
import { EventsTabType } from '../../mates/Events/models/EventsTabs';
import { isPastEvent, isPresentEvent } from '../../mates/Events/utilities';
import { FriendProfile } from '../../mates/Friends/models/FriendsInfo';
import { getNewId } from '../utilities';

interface CreateEventInputType {
    title: string;
    description: string;
    time: DateTimeInputType;
}

interface DemoCreateEventCellProps {
    setTab: React.Dispatch<React.SetStateAction<EventsTabType>>;
}

const DemoCreateEventCell: React.FC<DemoCreateEventCellProps> = ({ setTab }) => {
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
    const [error, setError] = useState('');
    const [showInviteFriendsModal, setShowInviteFriendsModal] = useState(false);
    const [showInviteesModal, setShowInviteesModal] = useState(false);

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
            const tenant = getTenant(user) as Tenant;

            const idPool = user.apartment.eventsInfo.events.concat(
                user.apartment.eventsInfo.invitations,
            );

            const newEvent: ApartmentEvent = {
                _id: getNewId(idPool, '_id'),
                creator: tenant.name + ' (' + user.apartment.profile.name + ')',
                creatorId: tenant.userId,
                time: convertToDateWithTime(input.time),
                hostApartmentId: user.apartment._id,
                invitees: invited.map((fp) => getApartmentSummaryFromFriendProfile(fp)),
                attendees: [],
                title: input.title,
                description: input.description,
            };
            user.apartment.eventsInfo.events.push(newEvent);
            setUser({ ...user });
            setError('');
            setInput(initialInput);

            let newTab: EventsTabType;
            if (isPastEvent(newEvent)) {
                newTab = 'Past';
            } else if (isPresentEvent(newEvent)) {
                newTab = 'Present';
            } else {
                newTab = 'Future';
            }
            setTab(newTab);
        }
    };

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

export default DemoCreateEventCell;
