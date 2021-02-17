import React from 'react';

import '../styles/ColoredMessageCells.css';

export interface RedMessageCellProps {
    message: string;
}

export const RedMessageCell: React.FC<RedMessageCellProps> = ({ message }) => (
    <p className="red-message">{message}</p>
);

export const GreenMessageCell: React.FC<RedMessageCellProps> = ({ message }) => {
    return <p className="green-message">{message}</p>;
};
