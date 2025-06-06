import './styles.scss';
import Modal from '../../components/Modal/index.jsx';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <Modal onClose={onCancel}>
        <div className={"confirm-dialog-overlay"}>
            <div className={"dialog"}>
                <p>{message}</p>
                <div className={"actions"}>
                    <button onClick={onConfirm} className="button-primary">Xác nhận</button>
                    <button onClick={onCancel} className="button-outline">Huỷ</button>
                </div>
            </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;
