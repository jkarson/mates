import React from 'react';
import { JoinRequest } from '../models/ProfileInfo';

interface ProfileJoinRequestCellProps {
    joinRequest: JoinRequest;
    handleAccept: (joinRequest: JoinRequest) => void;
    handleDelete: (joinRequest: JoinRequest) => void;
}

const ProfileJoinRequestCell: React.FC<ProfileJoinRequestCellProps> = ({
    joinRequest,
    handleAccept,
    handleDelete,
}) => (
    <div style={{ borderBottom: '1px solid black' }}>
        <h3>{joinRequest.username}</h3>
        <button onClick={() => handleAccept(joinRequest)}>{'Add to apartment'}</button>
        <button onClick={() => handleDelete(joinRequest)}>{'Delete Request '}</button>
    </div>
);

export default ProfileJoinRequestCell;
