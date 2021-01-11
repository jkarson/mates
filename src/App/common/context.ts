import { createContext } from 'react';
import { MatesUser, User } from './models';

export const MatesUserContext = createContext<MatesUserContextType | null>(null);

export interface MatesUserContextType {
    matesUser: MatesUser;
    setMatesUser: React.Dispatch<React.SetStateAction<MatesUser>>;
}

export const AccountContext = createContext<AccountContextType | null>(null);

export interface AccountContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
}
