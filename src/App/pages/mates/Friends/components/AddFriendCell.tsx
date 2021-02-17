import React, { useState } from 'react';
import { ApartmentSummary } from '../models/FriendsInfo';
import ApartmentSummaryCell from './ApartmentSummaryCell';

import '../styles/AddFriendCell.css';
import { SimpleButton } from '../../../../common/components/SimpleButtons';

interface AddFriendCellProps {
    potentialFriend: ApartmentSummary;
    handleAdd: (apartment: ApartmentSummary) => void;
}

const AddFriendCell: React.FC<AddFriendCellProps> = ({ potentialFriend, handleAdd }) => {
    const [serverCallMade, setServerCallMade] = useState(false);
    return (
        <div className="add-friend-cell-container">
            <ApartmentSummaryCell friend={potentialFriend} />
            <div className="add-friend-cell-button-container">
                <SimpleButton
                    onClick={() => {
                        if (!serverCallMade) {
                            setServerCallMade(true);
                            handleAdd(potentialFriend);
                        }
                    }}
                    text={'Send Friend Request'}
                />
            </div>
        </div>
    );
};

export default AddFriendCell;
