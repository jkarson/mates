import React, { useContext, useState } from 'react';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { Tenant } from '../../../common/models';
import { getTenant } from '../../../common/utilities';
import CreateMessageCell from '../../mates/Messages/components/CreateMessageCell';
import MessageCell from '../../mates/Messages/components/MessageCell';
import { MessageWithoutId, Message } from '../../mates/Messages/models/Message';
import { getNewId } from '../utilities';

const DemoMessages: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [error, setError] = useState('');

    const messages = user.apartment.messages;
    const tenant = getTenant(user) as Tenant;
    const author = tenant.name;

    const handleNewMessage = (message: MessageWithoutId) => {
        const messageId = getNewId(messages, '_id');
        messages.splice(0, 0, { ...message, _id: messageId });
        setUser({ ...user });
        setError('');
    };

    const handleDelete = (message: Message) => {
        const messageIndex = messages.findIndex(
            (apartmentMessage) => apartmentMessage._id === message._id,
        );
        if (messageIndex !== -1) {
            messages.splice(messageIndex, 1);
            setUser({ ...user });
            setError('Your message was deleted');
        }
    };

    const [input, setInput] = useState('');

    //TO DO: duplicate sender shouldn't automatically be false as below. model this after the updated Messages

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
            {/* <div style={{ padding: 30 }}>
                {messages.map((message) => (
                    <MessageCell
                        message={message}
                        key={message._id}
                        handleDelete={handleDelete}
                        canDelete={message.senderId === user.userId}
                        duplicateSender={false}
                    />
                ))}
            </div> */}
        </div>
    );
};

export default DemoMessages;
