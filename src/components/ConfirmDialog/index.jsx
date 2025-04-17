import './styles.scss';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <div className={"confirm-dialog-overlay"}>
            <div className={"dialog"}>
                <p>{message}</p>
                <div className={"actions"}>
                    <button onClick={onCancel} className={"cancel"}>Huỷ</button>
                    <button onClick={onConfirm} className={"confirm"}>Xoá</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
