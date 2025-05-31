import ReactDOM from 'react-dom';
import './styles.scss'; 

const Modal = ({ children, onClose }) => {
    const modalRoot = document.getElementById('modal-root');
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose && onClose();
        }
    };
    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <button
                    className="modal-close-btn"
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>,
        modalRoot
    );
};

export default Modal;
