import React, { useContext, useState } from 'react';
import { UserContext, UserContextType } from '../../Common/context';
import { Apartments } from '../../Common/mockData';
import { Apartment } from '../../Common/models';
import { FriendsTabType } from '../models/FriendsTabs';
import FriendSummaryCell from './FriendSummaryCell';

interface CreateFriendRequestCellProps {
    setTab: React.Dispatch<React.SetStateAction<FriendsTabType>>;
}

const CreateFriendRequestCell: React.FC<CreateFriendRequestCellProps> = ({ setTab }) => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const { friends, outgoingRequests, incomingRequests } = user.apartment.friendsInfo;

    //TO DO: ultimately, the pool of apartments will come from the server rather than be loaded from
    //mockData.ts
    const allApartments = Object.values(Apartments);
    const [input, setInput] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleAddFriend = (apartment: Apartment) => {
        setInput('');
        user.apartment.friendsInfo.outgoingRequests.push(apartment);
        //TO DO: SAVE TO DATABASE
        setUser({ ...user });
        setTab('Outgoing Requests');
    };

    return (
        <div>
            <form>
                <label>
                    {'Search for other apartments by name to add them as friends'}
                    <br />
                    <input
                        type="text"
                        placeholder={'e.g. SwaggerHouse'}
                        value={input}
                        onChange={handleChange}
                    />
                </label>
            </form>
            {allApartments
                .filter(
                    (apartment) =>
                        input.length > 0 &&
                        !friends.includes(apartment) &&
                        !incomingRequests.includes(apartment) &&
                        !outgoingRequests.includes(apartment) &&
                        user.apartment !== apartment &&
                        apartment.name.toLocaleLowerCase().includes(input.toLocaleLowerCase()),
                )
                .map((apartment) => (
                    <AddFriendCell handleAdd={handleAddFriend} potentialFriend={apartment} />
                ))}
        </div>
    );
};

interface AddFriendCellProps {
    potentialFriend: Apartment;
    handleAdd: (apartment: Apartment) => void;
}

const AddFriendCell: React.FC<AddFriendCellProps> = ({ potentialFriend, handleAdd }) => (
    <>
        <FriendSummaryCell friend={potentialFriend} />
        <button onClick={() => handleAdd(potentialFriend)}>{'Send Request'}</button>
    </>
);

export default CreateFriendRequestCell;
