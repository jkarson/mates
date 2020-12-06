export const choresTabNames = [
    'Today',
    'Upcoming',
    'Future',
    'Summary',
    'Completed',
    'Create New',
] as const;
export type ChoresTabType = typeof choresTabNames[number];
