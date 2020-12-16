export const eventsTabNames = [
    'Create New Event',
    'Past',
    'Present',
    'Future',
    'Event Invitations',
] as const;
export type EventsTabType = typeof eventsTabNames[number];
