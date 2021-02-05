import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import {
    getApartmentSummariesFromServerApartmentSummaries,
    getPostOptions,
} from '../../../../common/utilities';
import { ApartmentSummary } from '../models/FriendsInfo';
import { FriendsTabType } from '../models/FriendsTabs';
import ApartmentSummaryCell from './ApartmentSummaryCell';

import '../styles/CreateFriendRequestCell.css';
import StandardStyledText from '../../../../common/components/StandardStyledText';
import LastWordBoldTextCell from '../../../../common/components/LastWordBoldTextCell';
import StyledInput from '../../../../common/components/StyledInput';
import BiggerSimpleButton from '../../../../common/components/BiggerSimpleButton';
import RedMessageCell from '../../../../common/components/RedMessageCell';
import AddFriendCell from './AddFriendCell';

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
    const [searchError, setSearchError] = useState('');
    const [footerError, setFooterError] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        setSearchError('');
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
                    setSearchError('Sorry, that code is invalid.');
                    return;
                }
                setSearchError('');
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
                    setFooterError('Sorry, your friend request could not be sent');
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
                setFooterError('');
                setInput('');
                setTab('Outgoing Requests');
            });
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div className="create-friend-request-cell-container">
            <div className="create-friend-request-cell-text-container">
                <StandardStyledText text={'Search for other apartments by unique code.'} />
                <div className="create-friend-request-cell-line-break" />
                <LastWordBoldTextCell
                    mainText={" Your apartment's unique code is: "}
                    lastWord={user.apartment.profile.code}
                />
            </div>
            <div className="create-friend-request-cell-search-container">
                <StyledInput type="text" value={input} onChange={handleChange} />
                <BiggerSimpleButton onClick={handleSearchCode} text={'Search'} />
                {searchError.length === 0 ? null : <RedMessageCell message={searchError} />}
            </div>
            <div className="create-friend-request-cell-add-friend-container">
                {!friendSummary ? null : (
                    <AddFriendCell
                        potentialFriend={friendSummary}
                        handleAdd={handleSendFriendRequest}
                    />
                )}
            </div>
            <div className="create-friend-request-cell-error-container">
                {footerError.length === 0 ? null : <RedMessageCell message={footerError} />}
            </div>
        </div>
    );
};

export default CreateFriendRequestCell;
