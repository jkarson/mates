import React from 'react';
import '../styles/VerificationCell.css';

interface VerificationCellProps {
    isVerified: boolean;
}

const VerificationCell: React.FC<VerificationCellProps> = ({ isVerified }) => {
    if (isVerified) {
        return (
            <div className="verification-cell-green">
                <span>{'✓'}</span>
            </div>
        );
    } else {
        return (
            <div className="verification-cell-red">
                <span>{'X'}</span>
            </div>
        );
    }
};

export default VerificationCell;
