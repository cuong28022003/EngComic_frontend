import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import "./styles.scss";
import Modal from "../../../../components/Modal/index.jsx";
import { createReport } from "../../../../api/reportApi.js";
import { loginSuccess } from "../../../../redux/slice/auth.js";

function ReportModal({ comicId, onClose }) {
    const user = useSelector((state) => state.auth.login?.user);
    const dispatch = useDispatch();
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!user) {
            toast.warning("Vui lòng đăng nhập để báo cáo");
            onClose();
            return;
        }

        if (!reason.trim()) {
            toast.warning("Vui lòng nhập lý do báo cáo");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = {
                comicId,
                userId: user.id,
                reason,
            }
            const response = await createReport(data, user, dispatch, loginSuccess);

            toast.success("Gửi báo cáo thành công");
            onClose();
        } catch (error) {
            console.error("Error submitting report:", error);
            toast.error("Gửi báo cáo thất bại: " + error.message);
        } finally {
            setIsSubmitting(false); 
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className="report-container">
                <h3>Báo cáo truyện</h3>
                <textarea
                    className="textarea"
                    rows={5}
                    placeholder="Nhập lý do báo cáo..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <div className="modal-actions">
                    <button
                        className="button-outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                    <button
                        className="button-primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default ReportModal;