export const choresTabNames = [
    'Today',
    'Upcoming',
    'Future',
    'Completed',
    'Summary',
    'Create New',
] as const;
export type ChoresTabType = typeof choresTabNames[number];
