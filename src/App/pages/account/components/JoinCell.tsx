import React from 'react';
import { SimpleButton } from '../../../common/components/SimpleButtons';
import { ApartmentId } from '../../../common/models';
import ApartmentSummaryCell from '../../mates/Friends/components/ApartmentSummaryCell';
import { ApartmentSummary } from '../../mates/Friends/models/FriendsInfo';

import '../styles/JoinCell.css';

interface JoinCellProps {
    apartmentSummary: ApartmentSummary;
    handleClickJoin: (apartmentId: ApartmentId) => void;
}

const JoinCell: React.FC<JoinCellProps> = ({ apartmentSummary, handleClickJoin }) => (
    <div className="join-cell-container">
        <ApartmentSummaryCell friend={apartmentSummary} />
        <SimpleButton
            onClick={() => handleClickJoin(apartmentSummary.apartmentId)}
            text="Request to Join"
        />
    </div>
);

export default JoinCell;
