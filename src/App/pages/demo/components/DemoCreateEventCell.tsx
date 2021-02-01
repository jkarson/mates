import React, { useContext, useState } from 'react';
import DateTimeInputCell from '../../../common/components/DateTimeInputCell';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { Tenant } from '../../../common/models';
import { DateTimeInputType } from '../../../common/types';
import { getCurrentDateTime, getTenant, convertToDateWithTime } from '../../../common/utilities';
import { ApartmentEvent } from '../../mates/Events/models/EventsInfo';
import { EventsTabType } from '../../mates/Events/models/EventsTabs';
import { isPastEvent, isPresentEvent } from '../../mates/Events/utilities';
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

            const idPool = user.apartment.eventsInfo.events.concat(
                user.apartment.eventsInfo.invitations,
            );

            const newEvent: ApartmentEvent = {
                _id: getNewId(idPool, '_id'),
                creator: tenant.name + ' (' + user.apartment.profile.name + ')',
                creatorId: tenant.userId,
                time: convertToDateWithTime(input.time),
                hostApartmentId: user.apartment._id,
                invitees: [],
                attendees: [],
                title: input.title,
                description: input.description,
            };
            user.apartment.eventsInfo.events.push(newEvent);
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
        <div>
            {error.length === 0 ? null : <p style={{ color: 'red' }}>{error}</p>}
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

export default DemoCreateEventCell;
