export const friendsTabNames = [
    'Friends',
    'Incoming Requests',
    'Outgoing Requests',
    'Add New Friend',
] as const;
export type FriendsTabType = typeof friendsTabNames[number];
