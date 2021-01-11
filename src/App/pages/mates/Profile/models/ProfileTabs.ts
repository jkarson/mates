export const profileTabNames = ['Your Profile', 'Your Unique Code', 'Join Requests'] as const;
export type ProfileTabType = typeof profileTabNames[number];
