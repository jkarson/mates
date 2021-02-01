import React from 'react';
import '../styles/RedMessageCell.css';

export interface RedMessageCellProps {
    message: string;
}

const RedMessageCell: React.FC<RedMessageCellProps> = ({ message }) => (
    <p className="red-message">{message}</p>
);

export default RedMessageCell;
