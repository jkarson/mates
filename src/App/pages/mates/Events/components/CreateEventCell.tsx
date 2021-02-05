import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import DateTimeInputCell from '../../../../common/components/DateTimeInputCell';
import RedMessageCell from '../../../../common/components/RedMessageCell';
import SimpleButton from '../../../../common/components/SimpleButton';
import StyledInput from '../../../../common/components/StyledInput';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { Tenant } from '../../../../common/models';
import { DateTimeInputType } from '../../../../common/types';
import {
    getCurrentDateTime,
    getTenant,
    convertToDateWithTime,
    getPostOptions,
} from '../../../../common/utilities';
import { ApartmentEventWithoutId } from '../models/EventsInfo';
import { EventsTabType } from '../models/EventsTabs';
import { initializeServerEventsInfo, isPastEvent, isPresentEvent } from '../utilities';

import '../styles/CreateEventCell.css';

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
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        setInput({ ...input, [name]: event.target.value });
    };

    const setDateTimeState = (time: DateTimeInputType) => {
        setInput({ ...input, time: time });
    };

    const handleCreateEvent = () => {
        if (input.title) {
            const tenant = getTenant(user) as Tenant;

            const newEvent: ApartmentEventWithoutId = {
                creator: tenant.name + ' (' + user.apartment.profile.name + ')',
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
            };
            const options = getPostOptions(data);
            fetch('/mates/createEvent', options)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json);
                    const { authenticated, success } = json;
                    if (!authenticated) {
                        setRedirect(true);
                        return;
                    }
                    if (!success) {
                        setError('Sorry, the event could not be created at this time');
                        return;
                    }
                    const { eventsInfo } = json;
                    const formattedEventsInfo = initializeServerEventsInfo(eventsInfo);
                    const formattedNewEvent =
                        formattedEventsInfo.events[formattedEventsInfo.events.length - 1];
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
                });
        }
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div className="create-event-cell-container">
            <div className="create-event-cell-error-container">
                {error.length === 0 ? null : <RedMessageCell message={error} />}
            </div>
            <StyledInput
                type="text"
                name="title"
                placeholder={'* Title'}
                value={input.title}
                onChange={handleChange}
            />
            <StyledInput
                type="text"
                name="description"
                placeholder={'Description'}
                value={input.description}
                onChange={handleChange}
            />
            <DateTimeInputCell state={input.time} setState={setDateTimeState} />
            <div className="create-event-cell-button-container">
                <SimpleButton onClick={handleCreateEvent} text="Create Event" />
            </div>
        </div>
    );
};

export default CreateEventCell;
