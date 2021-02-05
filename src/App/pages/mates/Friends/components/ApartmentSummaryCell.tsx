import React from 'react';
import ApartmentIcon from '../../../../common/components/ApartmentIcon';
import StandardStyledText from '../../../../common/components/StandardStyledText';
import { formatNames } from '../../../../common/utilities';
import { ApartmentSummary } from '../models/FriendsInfo';

import '../styles/ApartmentSummaryCell.css';

interface ApartmentSummaryCellProps {
    friend: ApartmentSummary;
    onIconClick?: () => void;
}

const ApartmentSummaryCell: React.FC<ApartmentSummaryCellProps> = ({ friend, onIconClick }) => (
    <div className="apartment-summary-cell-container">
        <div onClick={onIconClick}>
            <ApartmentIcon />
        </div>
        <div className="apartment-summary-cell-info">
            <h3 onClick={onIconClick}>{friend.name}</h3>
            <StandardStyledText text={'Tenants: ' + formatNames(friend.tenantNames)} />
        </div>
    </div>
);
export default ApartmentSummaryCell;
