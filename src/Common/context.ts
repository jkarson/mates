import { createContext } from 'react';
import { User } from './models';

export const UserContext = createContext<UserContextType | null>(null);

export interface UserContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
}
