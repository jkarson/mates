import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import StandardStyledText from '../../../common/components/StandardStyledText';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { Tenant } from '../../../common/models';
import {
    getTenant,
    getPostOptions,
    initializeDates,
    getDeleteOptions,
} from '../../../common/utilities';
import CreateMessageCell from './components/CreateMessageCell';
import MessageCell, { UserMessageCell } from './components/MessageCell';
import { MessageWithoutId, ServerMessage, Message } from './models/Message';

import './Messages.css';

const Messages: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');
    const [input, setInput] = useState('');
    const [serverCallMade, setServerCallMade] = useState(false);

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
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        setError('sending...');
        const data = { ...message, time: message.time, apartmentId: user.apartment._id };
        const options = getPostOptions(data);
        fetch('/mates/postNewMessage', options)
            .then((res) => res.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setError('Sorry, your message could not be sent');
                    return;
                }
                const { savedMessages } = json;
                const serverMessages = savedMessages as ServerMessage[];
                const formattedMessages = initializeDates(serverMessages, 'time');
                setUser({
                    ...user,
                    apartment: { ...user.apartment, messages: formattedMessages as Message[] },
                });
                setError('');
                if (messagesContainerRef.current) {
                    const scrollView = messagesContainerRef.current;
                    scrollView.scrollTop = scrollView.scrollHeight - scrollView.clientHeight;
                }
            })
            .catch(() => setError('Sorry, our server seems to be down.'));
    };

    const handleDelete = (message: Message) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const data = { apartmentId: user.apartment._id, messageId: message._id };
        const options = getDeleteOptions(data);
        fetch('/mates/deleteMessage', options)
            .then((response) => response.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                }
                if (!success) {
                    setError('Sorry, your message could not be deleted.');
                }
                const { resultMessages } = json;
                const serverMessages = resultMessages as ServerMessage[];
                const formattedMessages = initializeDates(serverMessages, 'time');
                setUser({
                    ...user,
                    apartment: { ...user.apartment, messages: formattedMessages as Message[] },
                });
                setError('Your message was deleted.');
            })
            .catch(() => setError('Sorry, our server seems to be down.'));
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

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

export default Messages;
