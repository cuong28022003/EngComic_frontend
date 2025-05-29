import React from "react";
import "./styles.scss";
import { X } from "lucide-react";
import Modal from "../../../../components/Modal/index.jsx";
import { createTopupRequest } from "../../../../api/topupApi.js";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../../redux/slice/auth.js";
import { toast } from "react-toastify";

const PaymentModal = ({ isOpen, onClose, diamonds, price, qrImageUrl, user }) => {
    const dispatch = useDispatch();
    const content = `nap${diamonds}_${user?.username}`;
    if (!isOpen) return null;

    const handleSendTopupRequest = () => {
        const payload = {
            userId: user?.id,
            diamond: diamonds,
            note: content,
        }
        createTopupRequest(payload, user, dispatch, loginSuccess)
            .then(response => {
                toast.success("Yêu cầu nạp kim cương đã được gửi thành công!");
            })
            .catch(error => {
                console.error("Error creating topup request:", error);
                toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau.");
            });
        
        onClose();
    }

    return (
        <Modal onClose={onClose}>
            <div className="payment-modal">
                <button className="close-btn" onClick={onClose}>
                    <X size={20} />
                </button>
                <h3>Nạp {diamonds} 💎</h3>
                <p>Giá: {price.toLocaleString()} VND</p>

                <div className="qr-section">
                    <img src={qrImageUrl} alt="QR thanh toán" />
                </div>

                <div className="instructions">
                    <p><strong>Nội dung chuyển khoản:</strong></p>
                    <code>{content}</code>
                    <p style={{ fontSize: "0.9rem", color: "#777" }}>
                        * Vui lòng ghi chính xác để hệ thống xác minh.
                    </p>
                </div>

                <button className="confirm-btn" onClick={handleSendTopupRequest}>
                    Tôi đã thanh toán
                </button>
            </div>
        </Modal>
    );
};

export default PaymentModal;
