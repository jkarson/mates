import React from 'react';
import { Apartment } from '../../../../common/models';
import FriendSummaryCell from './FriendSummaryCell';

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

export default RequestCell;
