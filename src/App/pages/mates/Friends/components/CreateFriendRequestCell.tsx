import React, { useContext, useState } from 'react';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import {
    getApartmentSummariesFromServerApartmentSummaries,
    getPostOptions,
} from '../../../../common/utilities';
import { ServerApartmentEvent } from '../../Events/models/ServerEventsInfo';
import { ApartmentSummary } from '../models/FriendsInfo';
import { FriendsTabType } from '../models/FriendsTabs';
import { ServerApartmentSummary } from '../models/ServerFriendsInfo';
import ApartmentSummaryCell from './ApartmentSummaryCell';

interface CreateFriendRequestCellProps {
    setTab: React.Dispatch<React.SetStateAction<FriendsTabType>>;
}

const CreateFriendRequestCell: React.FC<CreateFriendRequestCellProps> = ({ setTab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [input, setInput] = useState('');
    const [friendSummary, setFriendSummary] = useState<ApartmentSummary | null>(null);
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        setError('');
        setFriendSummary(null);
    };

    const handleSearchCode = () => {
        const data = { code: input, apartmentId: user.apartment._id };
        const options = getPostOptions(data);
        fetch('/mates/searchCodeFriends', options)
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setError('Sorry, that code is invalid.');
                    return;
                }
                const { apartmentSummary } = json;
                console.log(apartmentSummary);
                setFriendSummary(apartmentSummary);
            });
    };

    const handleSendFriendRequest = (apartmentSummary: ApartmentSummary) => {
        const data = {
            userApartmentId: user.apartment._id,
            requesteeApartmentId: apartmentSummary.apartmentId,
        };
        const options = getPostOptions(data);
        fetch('/mates/sendFriendRequest', options)
            .then((response) => response.json())
            .then((json) => {
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setError('Sorry, your friend request could not be sent');
                    return;
                }
                const { newOutgoingRequests } = json;
                const outgoingRequestSummaries = getApartmentSummariesFromServerApartmentSummaries(
                    newOutgoingRequests,
                );
                setUser({
                    ...user,
                    apartment: {
                        ...user.apartment,
                        friendsInfo: {
                            ...user.apartment.friendsInfo,
                            outgoingRequests: outgoingRequestSummaries,
                        },
                    },
                });
                setInput('');
                setTab('Outgoing Requests');
            });
    };

    if (redirect) {
        setRedirect(true);
    }

    return (
        <div>
            <label>
                {'Search for other apartments by unique code to add them as friends'}
                <br />
                <input
                    type="text"
                    placeholder={'e.g. mH8aP2'}
                    value={input}
                    onChange={handleChange}
                />
                <button onClick={() => handleSearchCode()}>{'Search'}</button>
                {error.length === 0 ? null : <p style={{ color: 'red' }}>{error}</p>}
            </label>
            {!friendSummary ? null : (
                <AddFriendCell
                    potentialFriend={friendSummary}
                    handleAdd={handleSendFriendRequest}
                />
            )}
        </div>
    );
};

interface AddFriendCellProps {
    potentialFriend: ApartmentSummary;
    handleAdd: (apartment: ApartmentSummary) => void;
}

const AddFriendCell: React.FC<AddFriendCellProps> = ({ potentialFriend, handleAdd }) => (
    <>
        <ApartmentSummaryCell friend={potentialFriend} />
        <button onClick={() => handleAdd(potentialFriend)}>{'Send Request'}</button>
    </>
);

export default CreateFriendRequestCell;
