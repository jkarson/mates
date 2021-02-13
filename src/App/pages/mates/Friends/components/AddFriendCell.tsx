import React from 'react';
import SimpleButton from '../../../../common/components/SimpleButton';
import { ApartmentSummary } from '../models/FriendsInfo';
import ApartmentSummaryCell from './ApartmentSummaryCell';

import '../styles/AddFriendCell.css';

interface AddFriendCellProps {
    potentialFriend: ApartmentSummary;
    handleAdd: (apartment: ApartmentSummary) => void;
}

const AddFriendCell: React.FC<AddFriendCellProps> = ({ potentialFriend, handleAdd }) => (
    <div className="add-friend-cell-container">
        <ApartmentSummaryCell friend={potentialFriend} />
        <div className="add-friend-cell-button-container">
            <SimpleButton onClick={() => handleAdd(potentialFriend)} text={'Send Friend Request'} />
        </div>
    </div>
);

export default AddFriendCell;
