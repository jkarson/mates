export const contactsTabNames = [
    'All',
    'Your Apartment',
    'Friends',
    'Manually Added',
    'Add New Contact',
] as const;
export type ContactsTabType = typeof contactsTabNames[number];
