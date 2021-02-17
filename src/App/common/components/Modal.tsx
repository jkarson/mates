import React from 'react';

import '../styles/Modal.css';

interface ModalProps {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    content: JSX.Element;
}

const Modal: React.FC<ModalProps> = ({ show, setShow, content }) => {
    if (!show) {
        return null;
    }
    return (
        <div className="modal-container">
            <div
                className="empty-top"
                onClick={() => {
                    setShow(false);
                }}
            />
            <div
                className="empty-side-left"
                onClick={() => {
                    setShow(false);
                }}
            />
            <div className="modal">{content}</div>
            <div
                className="empty-side-right"
                onClick={() => {
                    setShow(false);
                }}
            />
            <div
                className="empty-bottom"
                onClick={() => {
                    setShow(false);
                }}
            />
        </div>
    );
};

export default Modal;
