export const accountTabNames = [
    'Your Apartments',
    'Your Join Requests',
    'Join An Apartment',
    'Create An Apartment',
] as const;
export type AccountTabType = typeof accountTabNames[number];
