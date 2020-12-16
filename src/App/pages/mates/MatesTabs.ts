export const matesTabNames = [
    'Profile',
    'Bills',
    'Chores',
    'Events',
    'Friends',
    'Contacts',
    'Messages',
] as const;
export type MatesTabType = typeof matesTabNames[number];
