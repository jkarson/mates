import React from 'react';
import { UserId } from '../../../../common/models';
import { StateProps } from '../../../../common/types';
import { MessageWithoutId } from '../models/Message';

interface CreateMessageCellProps extends StateProps<string> {
    author: string;
    authorId: UserId;
    handleNewMessage: (message: MessageWithoutId) => void;
}

const CreateMessageCell: React.FC<CreateMessageCellProps> = ({
    state,
    setState,
    author,
    authorId,
    handleNewMessage,
}) => {
    const handleSubmit = () => {
        if (state.length === 0) {
            return;
        }
        const newMessage: MessageWithoutId = {
            sender: author,
            senderId: authorId,
            time: new Date(Date.now()),
            content: state,
        };
        handleNewMessage(newMessage);
        setState('');
        //event.preventDefault();
    };

    return (
        <div>
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
            <button onClick={handleSubmit}>{'Send'}</button>
        </div>
    );
};

export default CreateMessageCell;
