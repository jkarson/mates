import React, { useContext, useState } from 'react';
import { Message, MessageWithoutId } from '../models/Message';
import { UserContext, UserContextType } from '../../Common/context';
import { getNewId, getTenant } from '../../Common/utilities';
import { Tenant } from '../../Common/models';
import CreateMessageCell from './CreateMessageCell';
import MessageCell from './MessageCell';

const Messages: React.FC = () => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const messages = user.apartment.messages;
    const tenant = getTenant(user) as Tenant;
    const author = tenant.name;

    const handleNewMessage = (message: MessageWithoutId) => {
        const newId = getNewId(messages);
        const newMessage: Message = { ...message, id: newId };
        messages.splice(0, 0, newMessage);
        //TO DO: SAVE TO DATABASE!
        setUser({ ...user });
    };

    const handleDelete = (message: Message) => {
        const index = messages.indexOf(message);
        messages.splice(index, 1);
        //TO DO: SAVE TO DATABASE!
        setUser({ ...user });
    };

    const [input, setInput] = useState('');

    return (
        <div>
            <p style={{ fontWeight: 'bold' }}>
                {'Messages will be visible to you and your roommates only.'}
            </p>
            <CreateMessageCell
                state={input}
                setState={setInput}
                author={author}
                authorId={user.tenantId}
                handleNewMessage={handleNewMessage}
            />
            <div style={{ padding: 30 }}>
                {messages.map((message) => (
                    <MessageCell
                        message={message}
                        key={message.id}
                        handleDelete={handleDelete}
                        canDelete={message.senderId === user.tenantId}
                    />
                ))}
            </div>
        </div>
    );
};

export default Messages;
