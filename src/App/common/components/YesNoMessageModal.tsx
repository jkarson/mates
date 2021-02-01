import React from 'react';
import BiggerSimpleButton from './BiggerSimpleButton';
import Modal from './Modal';
import StandardStyledText from './StandardStyledText';

import '../styles/YesNoMessageModal.css';
import SimpleButton from './SimpleButton';

interface YesNoMessageModalProps {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    message: string;
    onClickYes: () => void;
    yesText: string;
}

const YesNoMessageModal: React.FC<YesNoMessageModalProps> = ({
    show,
    setShow,
    message,
    onClickYes,
    yesText,
}) => {
    const modalContent = (
        <div className="yesnomessage-modal-container">
            <div className="yesnomessage-modal-message-container">
                <span>{message}</span>
            </div>
            <div className="yesnomessage-modal-no-button-container">
                <SimpleButton onClick={() => setShow(false)} text={'Cancel'} />
            </div>
            <div className="yesnomessage-modal-yes-button-container">
                <SimpleButton
                    onClick={() => {
                        setShow(false);
                        onClickYes();
                    }}
                    text={yesText}
                />
            </div>
        </div>
    );
    return <Modal show={show} setShow={setShow} content={modalContent} />;
};

export default YesNoMessageModal;
