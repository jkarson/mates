export const billsTabNames = [
    'Overdue',
    'Unresolved',
    'Upcoming',
    'Future',
    'Resolved',
    'Summary',
    'Create New',
] as const;
export type BillsTabType = typeof billsTabNames[number];
