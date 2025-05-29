import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.scss";
import { getTopupHistory, cancelTopupRequest } from "../../../api/topupApi";
import { useDispatch, useSelector } from "react-redux";
import loginSuccess from "../../../redux/slice/auth";
import { toast } from "react-toastify";
import Modal from "../../../components/Modal/index.jsx";

const TopupHistoryPage = () => {
    const user = useSelector((state) => state.auth.login?.user);
    const dispatch = useDispatch();
    const [history, setHistory] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTopup, setSelectedTopup] = useState(null);



    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const params = { userId: user.id };
                const response = await getTopupHistory(params, user, dispatch, loginSuccess);
                setHistory(response.data);
                console.log("Topup history fetched:", response.data);
            } catch (error) {
                console.error("Error fetching topup history:", error);
            }
        }
        fetchHistory();
    }, []);

    const openCancelModal = (topup) => {
        setSelectedTopup(topup);
        setModalOpen(true);
    };

    const handleCancel = (id) => {
        cancelTopupRequest(id, user, dispatch, loginSuccess)
            .then(response => {
                toast.success("Hủy giao dịch thành công!");
                setHistory(prevHistory =>
                    prevHistory.map(item =>
                        item.id === id ? { ...item, canceled: true } : item
                    )
                );
                setModalOpen(false);
            })
            .catch(error => {
                console.error("Error canceling topup request:", error);
                toast.error("Hủy giao dịch thất bại!");
            });

    };


    return (
        <div className="topup-history-page">
            <h2>Lịch sử yêu cầu nạp kim cương</h2>
            <div className="history-list">
                {history.length === 0 ? (
                    <p>Chưa có giao dịch nạp nào.</p>
                ) : (
                    history.map(item => (
                        <div key={item.id} className={`history-item ${item.processed ? "processed" : "pending"}`}>
                            <div className="top">
                                <strong>{item.diamond}💎</strong>
                                <span className="status">
                                    {item.processed ? "✅ Đã xử lý" : "🕒 Đang chờ xác minh"}
                                </span>
                            </div>
                            <div className="bottom">
                                <div>Mã yêu cầu: <code>{item.id}</code></div>
                                <span>Gửi lúc: {new Date(item.createdAt).toLocaleString()}</span>
                                {!item.processed && (
                                    <p className="warning">
                                        ⚠ Nếu bạn chưa chuyển khoản, vui lòng kiểm tra lại.
                                    </p>
                                )}
                            </div>
                            {!item.processed && !item.canceled && (
                                <button
                                    className="cancel-btn"
                                    onClick={() => openCancelModal(item.id)}
                                >
                                    Hủy giao dịch
                                </button>
                            )}

                            {item.canceled && <p className="canceled-text">❌ Đã hủy</p>}
                        </div>
                    ))
                )}
            </div>
            {modalOpen && selectedTopup && (
                <Modal onClose={() => setModalOpen(false)}>
                    <div className="confirm-modal">
                        <h3>Xác nhận hủy giao dịch</h3>
                        <p>Bạn có chắc muốn hủy yêu cầu nạp <code>{selectedTopup?.id}</code> không?</p>
                        <div className="modal-actions">
                            <button onClick={() => handleCancel(selectedTopup)} className="yes">Hủy yêu cầu</button>
                            <button onClick={() => setModalOpen(false)} className="no">Đóng</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default TopupHistoryPage;
