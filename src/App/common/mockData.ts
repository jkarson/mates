/*import { Contact } from '../pages/mates/Contacts/models/Contact';
import { ApartmentEvent } from '../pages/mates/Events/models/ApartmentEvent';
import { Message } from '../pages/mates/Messages/models/Message';
import { Apartment, ApartmentSummary, MatesUser, User } from './models';

const today = new Date(Date.now());
const yesterday = new Date(Date.now());
yesterday.setDate(yesterday.getDate() - 1);
const oldDate = new Date(Date.now());
oldDate.setMonth(oldDate.getMonth() - 1, oldDate.getDate() - 1);

const Crib: Apartment = {
    _id: '1',
    tenants: [
        {
            userId: '1',
            name: 'Jeremy',
            age: 24,
            email: 'jeremy.karson@gmail.com',
            number: '917-572-9648',
        },
        {
            userId: '2',
            name: 'Reda',
            age: 23,
            email: 'lamnijir@gmail.com',
            number: '347-237-1773',
        },
        {
            userId: '3',
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
    profile: {
        name: 'The Three Musketeers',
        code: 'NVi39g',
        address: '487 Atlantic Ave, #3, Brooklyn, NY 11217',
        quote: "You miss 100% of the shots you don't take",
        requests: [],
    },
};

const CribApartmentSummary: ApartmentSummary = {
    apartmentId: Crib._id,
    name: 'The Three Musketeers',
    tenantNames: ['Reda', 'Mark', 'Jeremy'],
};

const JeremyUser: User = {
    //id: '1',
    username: 'jkarson',
    apartments: [CribApartmentSummary],
    requestedApartments: [],
};

const Jeremy: MatesUser = {
    userId: '1',
    apartment: Crib,
};

const RedaUser: User = {
    //id: '2',
    username: 'moroccan_llama',
    apartments: [CribApartmentSummary],
    requestedApartments: [],
};

const Reda: MatesUser = {
    userId: '2',
    apartment: Crib,
};

const MarkUser: User = {
    username: 'makabematabe',
    apartments: [CribApartmentSummary],
    requestedApartments: [],
};

const Mark: MatesUser = {
    userId: '3',
    apartment: Crib,
};

const ImaginaryCrib: Apartment = {
    _id: '2',
    tenants: [
        {
            userId: '4',
            name: 'Evan',
            age: 25,
            email: 'schechter.evan@gmail.com',
            number: '646-761-1067',
        },
        {
            userId: '5',
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
    profile: {
        name: 'TrackSquad',
        code: 'bg73Hq',
        address: '172 Delancey St, #6D, New York, NY 10002',
        requests: [],
    },
};

const ImaginaryCribApartmentSummary: ApartmentSummary = {
    apartmentId: '2',
    name: 'Tracksquad',
    tenantNames: ['Jenny', 'Evan'],
};

const EvanUser: User = {
    username: 'schechter25',
    apartments: [ImaginaryCribApartmentSummary],
    requestedApartments: [CribApartmentSummary],
};

const Evan: MatesUser = {
    userId: '4',
    apartment: ImaginaryCrib,
};

const JennyUser: User = {
    username: 'lotovaa',
    apartments: [ImaginaryCribApartmentSummary],
    requestedApartments: [],
};

const Jenny: MatesUser = {
    userId: '5',
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
        _id: '6',
        name: 'Reilly West',
        number: '510-815-3685',
        email: 'reillyywest@gmail.com',
        manuallyAdded: true,
    },
    {
        _id: '7',
        name: 'Dad',
        number: '917-576-0907',
        email: 'gkarson13@gmail.com',
        manuallyAdded: true,
    },
];

const messages: Message[] = [
    {
        _id: '1',
        sender: 'Jeremy',
        senderId: '1',
        time: new Date('March 1, 2020 09:30:00'),
        content: "Hey what's up guys",
    },
    {
        _id: '2',
        sender: 'Reda',
        senderId: '2',
        time: new Date('June 6, 2020 16:20:20'),
        content: 'Yo who ate my gummy worms?',
    },
    {
        _id: '3',
        sender: 'Jeremy',
        senderId: '1',
        time: new Date('March 3, 2020 09:30:00'),
        content: 'Mark when are you coming home?',
    },
    {
        _id: '4',
        sender: 'Reda',
        senderId: '2',
        time: new Date('June 4, 2020 16:20:20'),
        content: 'Hahahaha',
    },
    {
        _id: '5',
        sender: 'Jeremy',
        senderId: '1',
        time: new Date('March 9, 2020 09:30:00'),
        content: "I'll be home in a half hour does anyone want anything?",
    },
    {
        _id: '6',
        sender: 'Reda',
        senderId: '2',
        time: new Date('June 1, 2020 16:20:20'),
        content: "Yo what's up guys?",
    },
].sort((a, b) => b.time.getTime() - a.time.getTime());

Crib.manuallyAddedContacts = manuallyAddedContacts;
Crib.eventsInfo.invitations = events;
Crib.messages = messages;

const MatesUsers = { Jeremy: Jeremy, Reda: Reda, Mark: Mark, Evan: Evan, Jenny: Jenny };
const Apartments = { Crib: Crib, ImaginaryCrib: ImaginaryCrib };

export { MatesUsers, Apartments };
*/

const a = 1;
export {};
