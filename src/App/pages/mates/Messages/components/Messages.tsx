import { MongoServerSelectionError } from 'mongodb';
import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { Tenant } from '../../../../common/models';
import {
    getDeleteOptions,
    getPostOptions,
    getPutOptions,
    getTenant,
    initializeDates,
} from '../../../../common/utilities';
import { Message, MessageWithoutId, ServerMessage } from '../models/Message';
import CreateMessageCell from './CreateMessageCell';
import MessageCell from './MessageCell';

//to do / extension: maybe make a "sent"/"delivered"/"✓" or something so people
// know their message reached the server

const Messages: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');

    const messages = user.apartment.messages;
    const tenant = getTenant(user) as Tenant;
    const author = tenant.name;

    const handleNewMessage = (message: MessageWithoutId) => {
        //const newMessage: MessageWithoutId = { ...message };
        const data = { ...message, time: message.time, apartmentId: user.apartment._id };
        const options = getPostOptions(data);
        fetch('/mates/postNewMessage', options)
            .then((res) => res.json())
            .then((json) => {
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setError('Sorry, your message could not be saved');
                    return;
                }
                const { savedMessages } = json;
                const serverMessages = savedMessages as ServerMessage[];
                const formattedMessages = initializeDates(serverMessages, 'time');
                setUser({
                    ...user,
                    apartment: { ...user.apartment, messages: formattedMessages as Message[] },
                });
            });
    };

    const handleDelete = (message: Message) => {
        const data = { apartmentId: user.apartment._id, messageId: message._id };
        const options = getDeleteOptions(data);
        fetch('/mates/deleteMessage', options)
            .then((response) => response.json())
            .then((json) => {
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                }
                if (!success) {
                    setError('Sorry, your message could not be deleted');
                }
                const { resultMessages } = json;
                const serverMessages = resultMessages as ServerMessage[];
                const formattedMessages = initializeDates(serverMessages, 'time');
                setUser({
                    ...user,
                    apartment: { ...user.apartment, messages: formattedMessages as Message[] },
                });
            });
        // const index = messages.indexOf(message);
        // messages.splice(index, 1);
        // //TO DO: SAVE TO DATABASE!
        // setUser({ ...user });
    };

    const [input, setInput] = useState('');

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div>
            <p style={{ fontWeight: 'bold' }}>
                {'Messages will be visible to you and your roommates only.'}
            </p>
            <CreateMessageCell
                state={input}
                setState={setInput}
                author={author}
                authorId={user.userId}
                handleNewMessage={handleNewMessage}
            />
            {error.length === 0 ? null : <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ padding: 30 }}>
                {messages.map((message) => (
                    <MessageCell
                        message={message}
                        key={message._id}
                        handleDelete={handleDelete}
                        canDelete={message.senderId === user.userId}
                    />
                ))}
            </div>
        </div>
    );
};

export default Messages;
