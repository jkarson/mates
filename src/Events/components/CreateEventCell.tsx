import React, { useContext, useState } from 'react';
import DateTimeInputCell from '../../Common/components/DateTimeInputCell';
import { UserContext, UserContextType } from '../../Common/context';
import { Tenant } from '../../Common/models';
import { DateTimeInputType } from '../../Common/types';
import {
    getTenant,
    getNewId,
    convertToDateWithTime,
    getCurrentDateTime,
} from '../../Common/utilities';
import { ApartmentEvent } from '../models/ApartmentEvent';
import { EventsTabType } from '../models/EventsTabs';
import { isPastEvent, isPresentEvent } from '../utilities';

interface CreateEventInputType {
    title: string;
    description: string;
    time: DateTimeInputType;
}

interface CreateEventCellProps {
    setTab: React.Dispatch<React.SetStateAction<EventsTabType>>;
}

const CreateEventCell: React.FC<CreateEventCellProps> = ({ setTab }) => {
    const { user, setUser } = useContext(UserContext) as UserContextType;

    const initialInput: CreateEventInputType = {
        title: '',
        description: '',
        time: getCurrentDateTime(),
    };
    const [input, setInput] = useState<CreateEventInputType>(initialInput);

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

            //TO DO: This isn't a sufficiently large IDPool, if IDs need to be universally unique.
            //This will require a server to be remedied.
            const IDPool = [
                ...user.apartment.eventsInfo.events,
                ...user.apartment.eventsInfo.invitations,
            ];

            const newId = getNewId(IDPool);
            const newEvent: ApartmentEvent = {
                id: newId,
                creator: tenant.name + ' (' + user.apartment.name + ')',
                creatorId: tenant.id,
                time: convertToDateWithTime(input.time),
                invitees: [],
                attendees: [],
                title: input.title,
                description: input.description,
            };
            user.apartment.eventsInfo.events.push(newEvent);
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
            setUser({ ...user });
            //TO DO: Save to database.
        }
    };

    return (
        <div>
            <label>
                {'Event Title: '}
                <input
                    type="text"
                    name="title"
                    placeholder={'required'}
                    value={input.title}
                    onChange={handleChange}
                />
            </label>
            <br />
            <label>
                {'Event Description:'}
                <input
                    type="text"
                    name="description"
                    placeholder={'optional'}
                    value={input.description}
                    onChange={handleChange}
                />
            </label>
            <br />
            <br />
            <DateTimeInputCell state={input.time} setState={setDateTimeState} />
            <br />
            <br />
            <button onClick={handleCreateEvent}>{'Create Event'}</button>
        </div>
    );
};

export default CreateEventCell;
