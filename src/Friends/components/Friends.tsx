import React, { useContext, useState } from 'react';
import { UserContext, UserContextType } from '../../Common/context';
import { Apartment } from '../../Common/models';
import { Apartments } from '../../Common/constants';
import { StaticApartmentProfile } from '../../Profile/components/Profile';
import { FriendSummaryCell } from './FriendSummaryCell';
import Tabs from '../../Common/components/Tabs';
import { assertUnreachable } from '../../Common/utilities';

//TO DO: all add/delete/create friend request actions are bi-directional.
//on the front end, we only need to display changes for current user. but on the back-end,
//we obviously need to adjust the other party accordingly.

//EXTENSION: make alphabetized?

// bug - able to search for self

const tabNames = ['Friends', 'Incoming Requests', 'Outgoing Requests', 'Add New Friend'] as const;
type FriendsTabType = typeof tabNames[number];

const Friends: React.FC = () => {
    const [tab, setTab] = useState<FriendsTabType>('Friends');

    let content: JSX.Element;
    switch (tab) {
        case 'Friends':
            content = <FriendsCell />;
            break;
        case 'Incoming Requests':
            content = <RequestsCell incoming={true} />;
            break;
        case 'Outgoing Requests':
            content = <RequestsCell incoming={false} />;
            break;
        case 'Add New Friend':
            content = <CreateRequestCell setTab={setTab} />;
            break;
        default:
            assertUnreachable(tab);
    }

    return (
        <div>
            <Tabs<FriendsTabType> currentTab={tab} setTab={setTab} tabNames={tabNames} />
            <p style={{ fontWeight: 'bold' }}>
                {
                    'Connect with other apartments to view their public profile, access their contact information, and invite them to events.'
                }
            </p>
            {content}
        </div>
    );
};

interface CreateRequestCellProps {
    setTab: React.Dispatch<React.SetStateAction<FriendsTabType>>;
}

const CreateRequestCell: React.FC<CreateRequestCellProps> = ({ setTab }) => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const { friends, outgoingRequests, incomingRequests } = user.apartment.friendsInfo;
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

interface RequestsCellProps {
    incoming: boolean;
}

const RequestsCell: React.FC<RequestsCellProps> = ({ incoming }) => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const { friends, incomingRequests, outgoingRequests } = user.apartment.friendsInfo;
    const requests = incoming ? incomingRequests : outgoingRequests;

    const handleAdd = (apartment: Apartment) => {
        handleDelete(apartment);
        friends.push(apartment);
        setUser({ ...user });
    };
    const handleDelete = (apartment: Apartment) => {
        const requestIndex = requests.indexOf(apartment);
        requests.splice(requestIndex, 1);
        setUser({ ...user });
    };

    return (
        <div>
            {!requests || requests.length === 0 ? (
                <p>{'You have no ' + (incoming ? 'incoming' : 'outgoing') + ' friend requests'}</p>
            ) : (
                <div>
                    <p>{'Your ' + (incoming ? 'incoming' : 'outgoing') + ' friend requests:'}</p>
                    {requests.map((request) => (
                        <RequestCell
                            request={request}
                            incoming={incoming}
                            handleAdd={handleAdd}
                            handleDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

interface RequestCellProps {
    request: Apartment;
    incoming: boolean;
    handleAdd: (apartment: Apartment) => void;
    handleDelete: (apartment: Apartment) => void;
}

const RequestCell: React.FC<RequestCellProps> = ({
    request,
    incoming,
    handleAdd,
    handleDelete,
}) => (
    <div>
        <FriendSummaryCell friend={request} />
        {incoming ? <button onClick={() => handleAdd(request)}>{'Add Friend'}</button> : null}
        <button onClick={() => handleDelete(request)}>{'Delete Request'}</button>
    </div>
);

const FriendsCell: React.FC = () => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const friends = user.apartment.friendsInfo.friends;

    const handleDelete = (apartment: Apartment) => {
        const requestIndex = friends.indexOf(apartment);
        friends.splice(requestIndex, 1);
        //TO DO: UPDATE DATABASE
        setUser({ ...user });
    };

    return (
        <div>
            {friends.length === 0 ? (
                <p>{'You do not have any friends yet.'}</p>
            ) : (
                <>
                    <p>{'Your friends:'}</p>
                    {friends.map((friend) => (
                        <Friend key={friend.id} friend={friend} handleDelete={handleDelete} />
                    ))}
                </>
            )}
        </div>
    );
};

interface FriendProps {
    friend: Apartment;
    handleDelete: (apartment: Apartment) => void;
}

const Friend: React.FC<FriendProps> = ({ friend, handleDelete }) => {
    const [showProfile, setShowProfile] = useState(false);
    const handleClick = () => {
        const curr = showProfile;
        setShowProfile(!curr);
    };

    return (
        <div>
            <FriendSummaryCell friend={friend} />
            <button onClick={handleClick}>{showProfile ? 'Minimize' : 'Expand'}</button>
            <button onClick={() => handleDelete(friend)}>{'Delete Friend'}</button>
            {showProfile ? <StaticApartmentProfile apartment={friend} /> : null}
        </div>
    );
};

export default Friends;
