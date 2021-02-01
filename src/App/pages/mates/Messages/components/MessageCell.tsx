import React, { useState } from 'react';
import YesNoMessageModal from '../../../../common/components/YesNoMessageModal';
import { getTwoDigitDateString } from '../../../../common/utilities';
import { Message } from '../models/Message';

import '../styles/MessageCell.css';

interface MessageCellProps {
    message: Message;
    duplicateSender: boolean;
}

const MessageCell: React.FC<MessageCellProps> = ({ message, duplicateSender }) => {
    return (
        <div className="message-cell-container">
            <div className="message-cell-sender-container">
                {duplicateSender ? null : <span>{message.sender}</span>}
            </div>
            <div
                className="message-cell-content-container"
                title={
                    getTwoDigitDateString(message.time) +
                    '\n' +
                    message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            >
                <span>{message.content}</span>
            </div>
        </div>
    );
};

interface UserMessageCellProps {
    message: Message;
    duplicateSender: boolean;
    handleDelete: (message: Message) => void;
}

export const UserMessageCell: React.FC<UserMessageCellProps> = ({
    message,
    duplicateSender,
    handleDelete,
}) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="user-message-cell-container">
            <div className="user-message-cell-modal-container">
                <YesNoMessageModal
                    show={showModal}
                    setShow={setShowModal}
                    message={'Delete message?'}
                    onClickYes={() => handleDelete(message)}
                    yesText="Yes"
                />
            </div>
            <div className="user-message-cell-sender-container">
                {duplicateSender ? null : <span>{message.sender}</span>}
            </div>
            <div
                className="user-message-cell-content-container"
                title={
                    getTwoDigitDateString(message.time) +
                    '\n' +
                    message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            >
                <span onClick={() => setShowModal(true)}>{message.content}</span>
            </div>
            {/* <div className="user-message-cell-delete-container">
                <button onClick={() => handleDelete(message)}>{'Delete Message'}</button>
            </div> */}
        </div>
    );
};

export default MessageCell;
