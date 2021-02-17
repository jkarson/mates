import React from 'react';
import { SimpleButton } from '../../../../common/components/SimpleButtons';
import { JoinRequest } from '../models/ProfileInfo';

import '../styles/ProfileJoinRequestCell.css';

interface ProfileJoinRequestCellProps {
    joinRequest: JoinRequest;
    handleAccept: (joinRequest: JoinRequest) => void;
    handleDelete: (joinRequest: JoinRequest) => void;
}

const ProfileJoinRequestCell: React.FC<ProfileJoinRequestCellProps> = ({
    joinRequest,
    handleAccept,
    handleDelete,
}) => {
    return (
        <div className="profile-join-request-cell-container">
            <div className="profile-join-request-cell-buttons-container">
                <div className="profile-join-request-cell-add-button-container">
                    <SimpleButton
                        onClick={() => {
                            handleAccept(joinRequest);
                        }}
                        text={'Add to Apartment'}
                    />
                </div>
                <div className="profile-join-request-cell-delete-button-container">
                    <SimpleButton
                        onClick={() => {
                            handleDelete(joinRequest);
                        }}
                        text={'Delete Request'}
                    />
                </div>
            </div>
            <div className="profile-join-request-cell-username-container">
                <span>{joinRequest.username}</span>
            </div>
        </div>
    );
};

export default ProfileJoinRequestCell;
