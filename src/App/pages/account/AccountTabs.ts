export const accountTabNames = [
    'Your Apartments',
    'Join An Apartment',
    'Create An Apartment',
] as const;
export type AccountTabType = typeof accountTabNames[number];
