import React from 'react';
import { ApartmentSummary } from '../models/FriendsInfo';
import ApartmentSummaryCell from './ApartmentSummaryCell';

interface RequestCellProps {
    request: ApartmentSummary;
    incoming: boolean;
    handleAdd: (apartment: ApartmentSummary) => void;
    handleDelete: (apartment: ApartmentSummary) => void;
}

const RequestCell: React.FC<RequestCellProps> = ({
    request,
    incoming,
    handleAdd,
    handleDelete,
}) => (
    <div>
        <ApartmentSummaryCell friend={request} />
        {incoming ? <button onClick={() => handleAdd(request)}>{'Add Friend'}</button> : null}
        <button onClick={() => handleDelete(request)}>{'Delete Request'}</button>
    </div>
);

export default RequestCell;
