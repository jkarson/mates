import React from 'react';
import { Apartment, ApartmentSummary } from '../../../../common/models';
import FriendProfileSummaryCell, { ApartmentSummaryCell } from './FriendSummaryCell';

interface RequestCellProps {
    request: ApartmentSummary;
    incoming: boolean;
    handleAdd: (apartment: ApartmentSummary) => void;
    handleDelete: (apartment: ApartmentSummary) => void;
}

//to do: fix type below
const RequestCell: React.FC<RequestCellProps> = ({
    request,
    incoming,
    handleAdd,
    handleDelete,
}) => (
    <div>
        <ApartmentSummaryCell friend={request} />
        {incoming ? (
            <button onClick={() => handleAdd((request as unknown) as ApartmentSummary)}>
                {'Add Friend'}
            </button>
        ) : null}
        <button onClick={() => handleDelete((request as unknown) as ApartmentSummary)}>
            {'Delete Request'}
        </button>
    </div>
);

export default RequestCell;
