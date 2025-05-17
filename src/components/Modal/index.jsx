// Modal.js
import React from 'react';
import ReactDOM from 'react-dom';
import './styles.scss'; 

const Modal = ({ children }) => {
    const modalRoot = document.getElementById('modal-root');
    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-content">{children}</div>
        </div>,
        modalRoot
    );
};

export default Modal;
