import React, { useContext, useState } from 'react';
import { Message, MessageWithoutId } from '../models/Message';
import { UserContext, UserContextType } from '../../Common/context';
import { StateProps, TenantId } from '../../Common/types';
import { getNewId, getTenant } from '../../Common/utilities';
import { Tenant } from '../../Common/models';

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

interface CreateMessageCellProps extends StateProps<string> {
    author: string;
    authorId: TenantId;
    handleNewMessage: (message: MessageWithoutId) => void;
}

const CreateMessageCell: React.FC<CreateMessageCellProps> = ({
    state,
    setState,
    author,
    authorId,
    handleNewMessage,
}) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const newMessage: MessageWithoutId = {
            sender: author,
            senderId: authorId,
            time: new Date(Date.now()),
            content: state,
        };
        handleNewMessage(newMessage);
        setState('');
        event.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit}>
            <label style={{ fontWeight: 'bold' }}>{author + ':'}</label>
            <div>
                <textarea
                    placeholder="Add your message here"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    rows={3}
                    cols={80}
                />
            </div>
            <input type="submit" value="Send" />
        </form>
    );
};

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

export default Messages;
