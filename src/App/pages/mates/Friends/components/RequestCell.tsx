import React from 'react';
import { ApartmentSummary } from '../models/FriendsInfo';
import ApartmentSummaryCell from './ApartmentSummaryCell';
import SimpleButton from '../../../../common/components/SimpleButton';

import '../styles/RequestCell.css';

interface RequestCellProps {
    request: ApartmentSummary;
    incoming: boolean;
    handleAdd: (apartment: ApartmentSummary) => void;
    handleDelete: (apartment: ApartmentSummary) => void;
}

const RequestCell: React.FC<RequestCellProps> = ({ request, incoming, handleAdd, handleDelete }) =>
    incoming ? (
        <IncomingRequestCell request={request} handleAdd={handleAdd} handleDelete={handleDelete} />
    ) : (
        <OutgoingRequestCell request={request} handleDelete={handleDelete} />
    );

interface IncomingRequestCellProps {
    request: ApartmentSummary;
    handleAdd: (apartment: ApartmentSummary) => void;
    handleDelete: (apartment: ApartmentSummary) => void;
}

const IncomingRequestCell: React.FC<IncomingRequestCellProps> = ({
    request,
    handleAdd,
    handleDelete,
}) => (
    <div className="incoming-request-cell-container">
        <div className="incoming-request-cell-buttons-container">
            <div className="incoming-request-cell-add-button-container">
                <SimpleButton onClick={() => handleAdd(request)} text={'Add Friend'} />
            </div>
            <div className="incoming-request-cell-delete-button-container">
                <SimpleButton onClick={() => handleDelete(request)} text={'Delete Request'} />
            </div>
        </div>
        <div className="incoming-request-cell-apartment-container">
            <ApartmentSummaryCell friend={request} />
        </div>
    </div>
);

interface OutgoingRequestCellProps {
    request: ApartmentSummary;
    handleDelete: (apartment: ApartmentSummary) => void;
}

const OutgoingRequestCell: React.FC<OutgoingRequestCellProps> = ({ request, handleDelete }) => (
    <div className="outgoing-request-cell-container">
        <div className="outgoing-request-cell-apartment-container">
            <ApartmentSummaryCell friend={request} />
        </div>
        <div className="outgoing-request-cell-delete-button-container">
            <SimpleButton onClick={() => handleDelete(request)} text={'Delete Friend Request'} />
        </div>
    </div>
);

export default RequestCell;
