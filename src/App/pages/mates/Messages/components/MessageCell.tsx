import React from 'react';
import { Message } from '../models/Message';

interface MessageCellProps {
    message: Message;
    canDelete: boolean;
    handleDelete: (message: Message) => void;
}

const MessageCell: React.FC<MessageCellProps> = ({ message, canDelete, handleDelete }) => {
    return (
        <div>
            <p style={{ fontWeight: 'bold' }}>{message.sender}</p>
            <p style={{ fontWeight: 'bold', fontSize: 'small' }}>
                {message.time.toLocaleDateString() + ', ' + message.time.toLocaleTimeString()}
            </p>
            <p>{message.content}</p>
            {canDelete ? (
                <button onClick={() => handleDelete(message)}>{'Delete Message'}</button>
            ) : null}
        </div>
    );
};

export default MessageCell;
