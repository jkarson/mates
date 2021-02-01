import React from 'react';
import RedMessageCell, { RedMessageCellProps } from './RedMessageCell';

import '../styles/GreenMessageCell.css';

const GreenMessageCell: React.FC<RedMessageCellProps> = ({ message }) => {
    return (
        <div className="green-message-cell-container">
            <RedMessageCell message={message} />
        </div>
    );
};

export default GreenMessageCell;
