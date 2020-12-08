import { Contact } from '../Contacts/models/Contact';
import { ApartmentEvent } from '../Events/models/ApartmentEvent';
import { Message } from '../Messages/models/Message';
import { Apartment, User } from './models';

const today = new Date(Date.now());
const yesterday = new Date(Date.now());
yesterday.setDate(yesterday.getDate() - 1);
const oldDate = new Date(Date.now());
oldDate.setMonth(oldDate.getMonth() - 1, oldDate.getDate() - 1);

const Crib: Apartment = {
    id: '1',
    tenants: [
        {
            id: '1',
            name: 'Jeremy',
            age: 24,
            email: 'jeremy.karson@gmail.com',
            number: '917-572-9648',
        },
        {
            id: '2',
            name: 'Reda',
            age: 23,
            email: 'lamnijir@gmail.com',
            number: '347-237-1773',
        },
        {
            id: '3',
            name: 'Mark',
            age: 25,
            email: 'markdj10025@gmail.com',
            number: '917-345-2288',
        },
    ],
    friendsInfo: {
        friends: [],
        incomingRequests: [],
        outgoingRequests: [],
    },
    eventsInfo: {
        events: [],
        invitations: [],
    },
    manuallyAddedContacts: [],
    messages: [],
    choresInfo: {
        choreGenerators: [
            {
                id: '1',
                name: 'Take out trash',
                assigneeIds: ['3'],
                updatedThrough: yesterday,
                frequency: 'Weekly',
                starting: today,
                showUntilCompleted: true,
            },
        ],
        chores: [
            {
                id: '1',
                choreGeneratorID: '3',
                name: 'oldChore',
                assigneeIds: ['1'],
                date: oldDate,
                completed: true,
                showUntilCompleted: true,
            },
        ],
    },
    billsInfo: {
        billGenerators: [],
        bills: [],
    },
    name: 'The Three Musketeers',
    location: '487 Atlantic Ave, #3, Brooklyn, NY 11217',
    quote: "You miss 100% of the shots you don't take",
};

const Jeremy: User = {
    tenantId: '1',
    apartment: Crib,
};

const Reda: User = {
    tenantId: '2',
    apartment: Crib,
};

const Mark: User = {
    tenantId: '3',
    apartment: Crib,
};

const ImaginaryCrib: Apartment = {
    id: '2',
    tenants: [
        {
            id: '4',
            name: 'Evan',
            age: 25,
            email: 'schechter.evan@gmail.com',
            number: '646-761-1067',
        },
        {
            id: '5',
            name: 'Jenny',
            age: 25,
            number: '646-469-2702',
        },
    ],
    friendsInfo: {
        friends: [],
        incomingRequests: [],
        outgoingRequests: [],
    },
    manuallyAddedContacts: [],
    messages: [],
    eventsInfo: {
        events: [],
        invitations: [],
    },
    choresInfo: {
        choreGenerators: [],
        chores: [],
    },
    billsInfo: {
        billGenerators: [],
        bills: [],
    },
    name: 'TrackSquad',
    location: '172 Delancey St, #6D, New York, NY 10002',
};

const Evan: User = {
    tenantId: '4',
    apartment: ImaginaryCrib,
};

const Jenny: User = {
    tenantId: '5',
    apartment: ImaginaryCrib,
};

//ImaginaryCrib.tenants = [Jenny.tenant, Evan.tenant];
//Crib.friendsInfo.outgoingRequests.push(ImaginaryCrib);
//Crib.friendsInfo.friends.push(ImaginaryCrib);
Crib.friendsInfo.friends.push(ImaginaryCrib);
const events: ApartmentEvent[] = [
    {
        id: '1',
        creator: 'Jeremy (The Three Musketeers)',
        creatorId: '1',
        time: new Date('October 26, 2021 09:30:00'),
        invitees: [],
        attendees: [],
        title: 'Cleaning',
        description: "Maria's coming",
    },
    {
        id: '2',
        creator: 'Reda (The Three Musketeers)',
        creatorId: '2',
        time: new Date('June 6, 2022 11:45:00'),
        invitees: [],
        attendees: [ImaginaryCrib],
        title: 'Party',
    },
    {
        id: '3',
        creator: 'Jenny (TrackSquad)',
        creatorId: '5',
        time: new Date('October 26, 2019, 15:41:00'),
        invitees: [],
        attendees: [],
        title: 'Brunch',
    },
];

const manuallyAddedContacts: Contact[] = [
    {
        id: '6',
        name: 'Reilly West',
        number: '510-815-3685',
        email: 'reillyywest@gmail.com',
        manuallyAdded: true,
    },
    {
        id: '7',
        name: 'Dad',
        number: '917-576-0907',
        email: 'gkarson13@gmail.com',
        manuallyAdded: true,
    },
];

const messages: Message[] = [
    {
        id: '1',
        sender: 'Jeremy',
        senderId: '1',
        time: new Date('March 1, 2020 09:30:00'),
        content: "Hey what's up guys",
    },
    {
        id: '2',
        sender: 'Reda',
        senderId: '2',
        time: new Date('June 6, 2020 16:20:20'),
        content: 'Yo who ate my gummy worms?',
    },
    {
        id: '3',
        sender: 'Jeremy',
        senderId: '1',
        time: new Date('March 3, 2020 09:30:00'),
        content: 'Mark when are you coming home?',
    },
    {
        id: '4',
        sender: 'Reda',
        senderId: '2',
        time: new Date('June 4, 2020 16:20:20'),
        content: 'Hahahaha',
    },
    {
        id: '5',
        sender: 'Jeremy',
        senderId: '1',
        time: new Date('March 9, 2020 09:30:00'),
        content: "I'll be home in a half hour does anyone want anything?",
    },
    {
        id: '6',
        sender: 'Reda',
        senderId: '2',
        time: new Date('June 1, 2020 16:20:20'),
        content: "Yo what's up guys?",
    },
].sort((a, b) => b.time.getTime() - a.time.getTime());

Crib.manuallyAddedContacts = manuallyAddedContacts;
Crib.eventsInfo.invitations = events;
Crib.messages = messages;

const Users = { Jeremy: Jeremy, Reda: Reda, Mark: Mark, Evan: Evan, Jenny: Jenny };
const Apartments = { Crib: Crib, ImaginaryCrib: ImaginaryCrib };

export { Users, Apartments };
