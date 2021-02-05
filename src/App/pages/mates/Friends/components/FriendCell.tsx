import React, { useState } from 'react';
import { getApartmentSummaryFromFriendProfile } from '../../../../common/utilities';
import { FriendProfile } from '../models/FriendsInfo';
import ApartmentSummaryCell from './ApartmentSummaryCell';

import '../styles/FriendCell.css';
import StaticApartmentProfileModal from '../../Profile/components/StaticApartmentProfileModal';
import SimpleButton from '../../../../common/components/SimpleButton';
import YesNoMessageModal from '../../../../common/components/YesNoMessageModal';

interface FriendCellProps {
    friend: FriendProfile;
    handleDelete: (apartment: FriendProfile) => void;
    setError: (message: string) => void;
}

const FriendCell: React.FC<FriendCellProps> = ({ friend, handleDelete, setError }) => {
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleClickProfile = () => {
        setError('');
        setShowProfileModal(true);
    };

    return (
        <div className="friend-cell-container">
            <YesNoMessageModal
                show={showDeleteModal}
                setShow={setShowDeleteModal}
                message={'Are you sure you want to unfriend this apartment?'}
                yesText={'Unfriend'}
                onClickYes={() => handleDelete(friend)}
            />
            <div className="friend-cell-apartment-container">
                <ApartmentSummaryCell
                    friend={getApartmentSummaryFromFriendProfile(friend)}
                    onIconClick={handleClickProfile}
                />
            </div>
            <div className="friend-cell-delete-button-container">
                <SimpleButton onClick={() => setShowDeleteModal(true)} text={'Unfriend'} />
            </div>
            {showProfileModal ? (
                <StaticApartmentProfileModal apartment={friend} setShow={setShowProfileModal} />
            ) : null}
        </div>
    );
};

export default FriendCell;
