import React, { useRef } from 'react';
import { UserId } from '../../../../common/models';
import { StateProps } from '../../../../common/types';
import { MessageWithoutId } from '../models/Message';

import '../styles/CreateMessageCell.css';

interface CreateMessageCellProps extends StateProps<string> {
    author: string;
    authorId: UserId;
    handleNewMessage: (message: MessageWithoutId) => void;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const CreateMessageCell: React.FC<CreateMessageCellProps> = ({
    state,
    setState,
    author,
    authorId,
    handleNewMessage,
    setError,
}) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const hiddenDiv = useRef<HTMLDivElement>(null);

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
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'unset';
        }
    };

    const handleChangeInput = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setError('');
        const input = event.target.value;
        if (input.length > 0 && input.charAt(input.length - 1) === '\n') {
            return handleSubmit();
        }
        setState(event.target.value);
        if (hiddenDiv.current && textAreaRef.current) {
            hiddenDiv.current.innerHTML = event.target.value + '<br style="line-height: 3px;">';
            hiddenDiv.current.style.visibility = 'hidden';
            hiddenDiv.current.style.display = 'block';
            textAreaRef.current.style.height = hiddenDiv.current.offsetHeight + 'px';
            hiddenDiv.current.style.visibility = 'visible';
            hiddenDiv.current.style.display = 'none';
        }
    };

    return (
        <div className="create-message-cell-container">
            <div className="create-message-cell-input-container">
                <div className="create-message-cell-hidden-div" ref={hiddenDiv} />
                <textarea
                    ref={textAreaRef}
                    placeholder="Add your message here..."
                    value={state}
                    onChange={handleChangeInput}
                    rows={1}
                />
            </div>
        </div>
    );
};

export default CreateMessageCell;
