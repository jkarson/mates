import React from 'react';

interface VerificationCellProps {
    isVerified: boolean;
}

const VerificationCell: React.FC<VerificationCellProps> = ({ isVerified }) => {
    if (isVerified) {
        return (
            <div>
                <span style={{ color: 'green' }}>{'✓'}</span>
            </div>
        );
    } else {
        return (
            <div>
                <span style={{ color: 'red' }}>{'X'}</span>
            </div>
        );
    }
};

export default VerificationCell;
