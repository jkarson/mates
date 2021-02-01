import { MatesUser } from '../../../common/models';
import { ChoresInfo } from '../../mates/Chores/models/ChoresInfo';
import { FriendProfile } from '../../mates/Friends/models/FriendsInfo';

const demoMatesUser: MatesUser = {
    username: 'john_1998',
    userId: '1',
    apartment: {
        _id: '1',
        tenants: [
            {
                userId: '1',
                name: 'John',
                age: '22',
                number: '2128766502',
            },
            {
                userId: '2',
                name: 'Sarah',
                age: '24',
                email: 'sarah96@hotmail.com',
            },
            {
                userId: '3',
                name: 'Greg',
                age: '23',
                number: '5148889723',
                email: 'greggy_boy@gmail.com',
            },
        ],
        profile: {
            code: 'Q23Jl',
            name: 'House of Mirth',
            quote: 'What a time to be alive',
            address: 'Williamsburg, Brooklyn',
            requests: [{ _id: '4', username: 'alan_da_boy' }],
        },
        friendsInfo: {
            friends: [
                {
                    apartmentId: '2',
                    code: 'JJ572',
                    name: 'The Spice Girls',
                    quote: "If you can't handle the heat, get out of the kitchen",
                    tenants: [
                        {
                            userId: '5',
                            name: 'Jeanie',
                            age: '27',
                        },
                        {
                            userId: '6',
                            name: 'Carlos',
                            age: '22',
                            number: '2925689843',
                        },
                    ],
                },
                {
                    apartmentId: '3',
                    code: 'm78',
                    name: 'New Kids On The Block',
                    address: '322 Lansing Avenue',
                    tenants: [
                        {
                            userId: '7',
                            name: 'Sean',
                            age: '19',
                            email: 'seannnn1776@gmail.com',
                        },
                        {
                            userId: '8',
                            name: 'Angela',
                            age: '32',
                            number: '5667239012',
                        },
                        {
                            userId: '9',
                            name: 'Ramirez',
                            age: '26',
                        },
                    ],
                },
            ],
            incomingRequests: [
                {
                    apartmentId: '4',
                    name: 'The X Factor',
                    tenantNames: ['Peggy', 'Khalil', 'Kayla', 'Amber'],
                },
            ],
            outgoingRequests: [
                {
                    apartmentId: '5',
                    name: 'God Squad',
                    tenantNames: ['Theo', 'Baxter', 'Gerald'],
                },
            ],
        },
        eventsInfo: {
            events: [
                {
                    _id: '1',
                    creator: 'John (House of Mirth)',
                    creatorId: '1',
                    hostApartmentId: '1',
                    time: new Date('December 31, 2020 20:00:00'),
                    invitees: [
                        {
                            apartmentId: '2',
                            name: 'The Spice Girls',
                            tenantNames: ['Jeanie', 'Carlos'],
                        },
                    ],
                    attendees: [
                        {
                            apartmentId: '3',
                            name: 'New Kids On The Block',
                            tenantNames: ['Sean', 'Angela', 'Ramirez'],
                        },
                    ],
                    title: "New Year's Eve Party",
                    description: "Let's end 2020 with a bang!",
                },
                {
                    _id: '2',
                    creator: 'Ramirez (New Kids On The Block)',
                    creatorId: '9',
                    hostApartmentId: '3',
                    time: new Date(Date.now()),
                    invitees: [],
                    attendees: [],
                    title: 'Dinner Party',
                },
            ],
            invitations: [
                {
                    _id: '3',
                    creator: 'Jeanie (The Spice Girls)',
                    creatorId: '5',
                    hostApartmentId: '2',
                    time: new Date('April 10, 2021 09:00:00'),
                    invitees: [
                        {
                            apartmentId: '1',
                            name: 'House of Mirth',
                            tenantNames: ['John', 'Sarah', 'Greg'],
                        },
                    ],
                    attendees: [],
                    title: 'Camping Trip',
                    description: 'I promise it will be fun!',
                },
            ],
        },
        messages: [
            {
                _id: '2',
                sender: 'John',
                senderId: '1',
                time: new Date('January 1, 2021 12:01:00'),
                content: 'I agree!!!!',
            },
            {
                _id: '1',
                sender: 'Sarah',
                senderId: '2',
                time: new Date('January 1, 2021 12:00:00'),
                content: 'This is so awesome!',
            },
        ],
        manuallyAddedContacts: [
            {
                _id: '14',
                name: 'Landlord Steve',
                manuallyAdded: true,
                number: '8887563203',
            },
            {
                _id: '15',
                name: "Teddy's Pizzeria",
                manuallyAdded: true,
                number: '2129067316',
            },
        ],
        choresInfo: {
            choreGenerators: [
                {
                    _id: '0',
                    name: 'Pay Rent',
                    assigneeIds: ['2'],
                    frequency: 'Monthly',
                    showUntilCompleted: true,
                    starting: new Date('Fri Jan 01 2021 01:46:11 GMT-0500 (Eastern Standard Time)'),
                    updatedThrough: new Date(
                        'Mon Jan 17 2022 01:54:27 GMT-0500 (Eastern Standard Time)',
                    ),
                },
                {
                    _id: '1',
                    name: 'Clean Attic',
                    assigneeIds: ['1'],
                    frequency: 'Quarterly',
                    showUntilCompleted: true,
                    starting: new Date('Sun Jan 10 2021 02:11:36 GMT-0500 (Eastern Standard Time)'),
                    updatedThrough: new Date(
                        'Mon Jan 17 2022 02:12:21 GMT-0500 (Eastern Standard Time)',
                    ),
                },
            ],
            chores: [
                {
                    _id: '0',
                    assigneeIds: ['2'],
                    choreGeneratorId: '0',
                    completed: true,
                    completedBy: '2',
                    date: new Date('Fri Jan 01 2021 01:46:11 GMT-0500 (Eastern Standard Time)'),
                    name: 'Pay Rent',
                    showUntilCompleted: true,
                },
                {
                    _id: '1',
                    assigneeIds: ['2'],
                    choreGeneratorId: '0',
                    completed: false,
                    date: new Date('Mon Feb 01 2021 01:46:11 GMT-0500 (Eastern Standard Time)'),
                    name: 'Pay Rent',
                    showUntilCompleted: true,
                },
                {
                    _id: '2',
                    assigneeIds: ['2'],
                    choreGeneratorId: '0',
                    completed: false,
                    date: new Date('Mon Mar 01 2021 01:46:11 GMT-0500 (Eastern Standard Time)'),
                    name: 'Pay Rent',
                    showUntilCompleted: true,
                },
                {
                    _id: '3',
                    assigneeIds: ['2'],
                    choreGeneratorId: '0',
                    completed: false,
                    date: new Date('Thu Apr 01 2021 01:46:11 GMT-0400 (Eastern Daylight Time)'),
                    name: 'Pay Rent',
                    showUntilCompleted: true,
                },
                {
                    _id: '4',
                    assigneeIds: ['2'],
                    choreGeneratorId: '0',
                    completed: false,
                    date: new Date('Sat May 01 2021 01:46:11 GMT-0400 (Eastern Daylight Time)'),
                    name: 'Pay Rent',
                    showUntilCompleted: true,
                },
                {
                    _id: '5',
                    assigneeIds: ['2'],
                    choreGeneratorId: '0',
                    completed: false,
                    date: new Date('Tue Jun 01 2021 01:46:11 GMT-0400 (Eastern Daylight Time)'),
                    name: 'Pay Rent',
                    showUntilCompleted: true,
                },
                {
                    _id: '6',
                    assigneeIds: ['2'],
                    choreGeneratorId: '0',
                    completed: false,
                    date: new Date('Thu Jul 01 2021 01:46:11 GMT-0400 (Eastern Daylight Time)'),
                    name: 'Pay Rent',
                    showUntilCompleted: true,
                },
                {
                    _id: '7',
                    assigneeIds: ['2'],
                    choreGeneratorId: '0',
                    completed: false,
                    date: new Date('Sun Aug 01 2021 01:46:11 GMT-0400 (Eastern Daylight Time)'),
                    name: 'Pay Rent',
                    showUntilCompleted: true,
                },
                {
                    _id: '8',
                    assigneeIds: ['2'],
                    choreGeneratorId: '0',
                    completed: false,
                    date: new Date('Wed Sep 01 2021 01:46:11 GMT-0400 (Eastern Daylight Time)'),
                    name: 'Pay Rent',
                    showUntilCompleted: true,
                },
                {
                    _id: '9',
                    assigneeIds: ['2'],
                    choreGeneratorId: '0',
                    completed: false,
                    date: new Date('Fri Oct 01 2021 01:46:11 GMT-0400 (Eastern Daylight Time)'),
                    name: 'Pay Rent',
                    showUntilCompleted: true,
                },
                {
                    _id: '10',
                    assigneeIds: ['2'],
                    choreGeneratorId: '0',
                    completed: false,
                    date: new Date('Mon Nov 01 2021 01:46:11 GMT-0400 (Eastern Daylight Time)'),
                    name: 'Pay Rent',
                    showUntilCompleted: true,
                },
                {
                    _id: '11',
                    assigneeIds: ['2'],
                    choreGeneratorId: '0',
                    completed: false,
                    date: new Date('Wed Dec 01 2021 01:46:11 GMT-0500 (Eastern Standard Time)'),
                    name: 'Pay Rent',
                    showUntilCompleted: true,
                },
                {
                    _id: '12',
                    assigneeIds: ['2'],
                    choreGeneratorId: '0',
                    completed: false,
                    date: new Date('Sat Jan 01 2022 01:46:11 GMT-0500 (Eastern Standard Time)'),
                    name: 'Pay Rent',
                    showUntilCompleted: true,
                },
                {
                    _id: '13',
                    assigneeIds: ['1'],
                    choreGeneratorId: '1',
                    completed: true,
                    completedBy: '1',
                    date: new Date('Sun Jan 10 2021 02:11:36 GMT-0500 (Eastern Standard Time)'),
                    name: 'Clean attic',
                    showUntilCompleted: true,
                },
                {
                    _id: '14',
                    assigneeIds: ['1'],
                    choreGeneratorId: '1',
                    completed: false,
                    date: new Date('Sat Apr 10 2021 02:11:36 GMT-0400 (Eastern Daylight Time)'),
                    name: 'Clean attic',
                    showUntilCompleted: true,
                },
                {
                    _id: '15',
                    assigneeIds: ['1'],
                    choreGeneratorId: '1',
                    completed: false,
                    date: new Date('Sat Jul 10 2021 02:11:36 GMT-0400 (Eastern Daylight Time)'),
                    name: 'Clean attic',
                    showUntilCompleted: true,
                },
                {
                    _id: '16',
                    assigneeIds: ['1'],
                    choreGeneratorId: '1',
                    completed: false,
                    date: new Date('Sun Oct 10 2021 02:11:36 GMT-0400 (Eastern Daylight Time)'),
                    name: 'Clean attic',
                    showUntilCompleted: true,
                },
                {
                    _id: '17',
                    assigneeIds: ['1'],
                    choreGeneratorId: '1',
                    completed: false,
                    date: new Date('Mon Jan 10 2022 02:11:36 GMT-0500 (Eastern Standard Time)'),
                    name: 'Clean attic',
                    showUntilCompleted: true,
                },
            ],
        },
        billsInfo: {
            billGenerators: [
                {
                    _id: '0',
                    amountsWithPercentOwed: [
                        {
                            amount: '25.00',
                            amountValue: 25,
                            percent: '33.3',
                            percentValue: 33.3,
                            userId: '1',
                        },
                        {
                            amount: '25.00',
                            amountValue: 25,
                            percent: '33.3',
                            percentValue: 33.3,
                            userId: '2',
                        },
                        {
                            amount: '25.00',
                            amountValue: 25,
                            percent: '33.3',
                            percentValue: 33.3,
                            userId: '3',
                        },
                    ],
                    frequency: 'Monthly',
                    isPrivate: false,
                    name: 'WiFi',
                    payableTo: 'Verizon',
                    privateTenantId: undefined,
                    starting: new Date('Fri Jan 01 2021 02:19:55 GMT-0500 (Eastern Standard Time)'),
                    updatedThrough: new Date(
                        'Mon Jan 17 2022 02:21:18 GMT-0500 (Eastern Standard Time)',
                    ),
                },
            ],
            bills: [
                {
                    _id: '0',
                    amountsOwed: [
                        {
                            userId: '1',
                            initialAmount: 25,
                            currentAmount: 0,
                        },
                        {
                            userId: '2',
                            initialAmount: 25,
                            currentAmount: 0,
                        },
                        {
                            userId: '3',
                            initialAmount: 25,
                            currentAmount: 0,
                        },
                    ],
                    billGeneratorId: '0',
                    name: 'WiFi',
                    payableTo: 'Verizon',
                    isPrivate: false,
                    date: new Date('Fri Jan 01 2021 02:26:55 GMT-0500 (Eastern Standard Time)'),
                },
                {
                    _id: '1',
                    amountsOwed: [
                        {
                            userId: '1',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '2',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '3',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                    ],
                    billGeneratorId: '0',
                    name: 'WiFi',
                    payableTo: 'Verizon',
                    isPrivate: false,
                    date: new Date('Mon Feb 01 2021 02:26:55 GMT-0500 (Eastern Standard Time)'),
                },
                {
                    _id: '2',
                    amountsOwed: [
                        {
                            userId: '1',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '2',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '3',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                    ],
                    billGeneratorId: '0',
                    name: 'WiFi',
                    payableTo: 'Verizon',
                    isPrivate: false,
                    date: new Date('Mon Mar 01 2021 02:26:55 GMT-0500 (Eastern Standard Time)'),
                },
                {
                    _id: '3',
                    amountsOwed: [
                        {
                            userId: '1',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '2',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '3',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                    ],
                    billGeneratorId: '0',
                    name: 'WiFi',
                    payableTo: 'Verizon',
                    isPrivate: false,
                    date: new Date('Thu Apr 01 2021 02:26:55 GMT-0400 (Eastern Daylight Time)'),
                },
                {
                    _id: '4',
                    amountsOwed: [
                        {
                            userId: '1',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '2',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '3',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                    ],
                    billGeneratorId: '0',
                    name: 'WiFi',
                    payableTo: 'Verizon',
                    isPrivate: false,
                    date: new Date('Sat May 01 2021 02:26:55 GMT-0400 (Eastern Daylight Time)'),
                },
                {
                    _id: '5',
                    amountsOwed: [
                        {
                            userId: '1',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '2',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '3',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                    ],
                    billGeneratorId: '0',
                    name: 'WiFi',
                    payableTo: 'Verizon',
                    isPrivate: false,
                    date: new Date('Tue Jun 01 2021 02:26:55 GMT-0400 (Eastern Daylight Time)'),
                },
                {
                    _id: '6',
                    amountsOwed: [
                        {
                            userId: '1',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '2',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '3',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                    ],
                    billGeneratorId: '0',
                    name: 'WiFi',
                    payableTo: 'Verizon',
                    isPrivate: false,
                    date: new Date('Thu Jul 01 2021 02:26:55 GMT-0400 (Eastern Daylight Time)'),
                },
                {
                    _id: '7',
                    amountsOwed: [
                        {
                            userId: '1',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '2',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '3',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                    ],
                    billGeneratorId: '0',
                    name: 'WiFi',
                    payableTo: 'Verizon',
                    isPrivate: false,
                    date: new Date('Sun Aug 01 2021 02:26:55 GMT-0400 (Eastern Daylight Time)'),
                },
                {
                    _id: '8',
                    amountsOwed: [
                        {
                            userId: '1',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '2',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '3',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                    ],
                    billGeneratorId: '0',
                    name: 'WiFi',
                    payableTo: 'Verizon',
                    isPrivate: false,
                    date: new Date('Wed Sep 01 2021 02:26:55 GMT-0400 (Eastern Daylight Time)'),
                },
                {
                    _id: '9',
                    amountsOwed: [
                        {
                            userId: '1',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '2',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '3',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                    ],
                    billGeneratorId: '0',
                    name: 'WiFi',
                    payableTo: 'Verizon',
                    isPrivate: false,
                    date: new Date('Fri Oct 01 2021 02:26:55 GMT-0400 (Eastern Daylight Time)'),
                },
                {
                    _id: '10',
                    amountsOwed: [
                        {
                            userId: '1',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '2',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '3',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                    ],
                    billGeneratorId: '0',
                    name: 'WiFi',
                    payableTo: 'Verizon',
                    isPrivate: false,
                    date: new Date('Mon Nov 01 2021 02:26:55 GMT-0400 (Eastern Daylight Time)'),
                },
                {
                    _id: '11',
                    amountsOwed: [
                        {
                            userId: '1',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '2',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '3',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                    ],
                    billGeneratorId: '0',
                    name: 'WiFi',
                    payableTo: 'Verizon',
                    isPrivate: false,
                    date: new Date('Wed Dec 01 2021 02:26:55 GMT-0500 (Eastern Standard Time)'),
                },
                {
                    _id: '12',
                    amountsOwed: [
                        {
                            userId: '1',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '2',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                        {
                            userId: '3',
                            initialAmount: 25,
                            currentAmount: 25,
                        },
                    ],
                    billGeneratorId: '0',
                    name: 'WiFi',
                    payableTo: 'Verizon',
                    isPrivate: false,
                    date: new Date('Sat Jan 01 2022 02:26:55 GMT-0500 (Eastern Standard Time)'),
                },
            ],
        },
    },
};

const choresInfo: ChoresInfo = {
    choreGenerators: [],
    chores: [],
};

const potentialNewFriend: FriendProfile = {
    apartmentId: '4',
    code: 'blfy7',
    name: 'The X Factor',
    quote: 'Prepare to be amazed!!!',
    address: 'Washington DC',
    tenants: [
        {
            userId: '10',
            name: 'Peggy',
            number: '9174316783',
        },
        {
            userId: '11',
            name: 'Khalil',
            email: 'khalil_the_man@aol.com',
            number: '3435552401',
        },
        {
            userId: '12',
            name: 'Kayla',
        },
        {
            userId: '13',
            name: 'Amber',
            email: 'superstaramber@gmail.com',
        },
    ],
};

export { demoMatesUser, potentialNewFriend };
