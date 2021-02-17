import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import StandardStyledText from '../../../common/components/StandardStyledText';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { Tenant } from '../../../common/models';
import { getTenant } from '../../../common/utilities';
import CreateMessageCell from '../../mates/Messages/components/CreateMessageCell';
import MessageCell, { UserMessageCell } from '../../mates/Messages/components/MessageCell';
import { MessageWithoutId, Message } from '../../mates/Messages/models/Message';
import { getNewId } from '../utilities';

const DemoMessages: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [error, setError] = useState('');
    const [input, setInput] = useState('');

    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const messages = user.apartment.messages;
    const tenant = getTenant(user) as Tenant;
    const author = tenant.name;

    useLayoutEffect(() => {
        if (messagesContainerRef.current) {
            const scrollView = messagesContainerRef.current;
            scrollView.scrollTop = scrollView.scrollHeight - scrollView.clientHeight;
        }
    }, []);

    const handleNewMessage = (message: MessageWithoutId) => {
        const messageId = getNewId(messages, '_id');
        messages.push({ ...message, _id: messageId });
        setUser({ ...user });
        setError('');
        if (messagesContainerRef.current) {
            const scrollView = messagesContainerRef.current;
            scrollView.scrollTop = scrollView.scrollHeight - scrollView.clientHeight;
        }
    };

    const handleDelete = (message: Message) => {
        const messageIndex = messages.findIndex(
            (apartmentMessage) => apartmentMessage._id === message._id,
        );
        if (messageIndex !== -1) {
            messages.splice(messageIndex, 1);
            setUser({ ...user });
            setError('Your message was deleted.');
        }
    };

    const messagesContent = messages.map((message, index) => {
        let duplicateSender = false;
        if (index > 0 && messages[index - 1].senderId === message.senderId) {
            duplicateSender = true;
        }
        if (message.senderId === user.userId) {
            return (
                <UserMessageCell
                    key={message._id}
                    message={message}
                    handleDelete={handleDelete}
                    duplicateSender={duplicateSender}
                />
            );
        } else {
            return (
                <MessageCell
                    key={message._id}
                    message={message}
                    duplicateSender={duplicateSender}
                />
            );
        }
    });

    return (
        <div className="messages-container">
            <div className="messages-header-container">
                <StandardStyledText
                    text={'Messages will be visible to you and your roommates only.'}
                />
            </div>
            <div className="messages-messages-container" ref={messagesContainerRef}>
                {messagesContent}
            </div>
            <div className="messages-create-message-container">
                <CreateMessageCell
                    state={input}
                    setState={setInput}
                    author={author}
                    authorId={user.userId}
                    handleNewMessage={handleNewMessage}
                    setError={setError}
                />
                <div className="messages-create-message-error">
                    {error.length === 0 ? null : <RedMessageCell message={error} />}
                </div>
            </div>
        </div>
    );
};

export default DemoMessages;
