import { useState } from "react";
import { toast } from "react-toastify";
import apiMain from "../api/apiMain";
import { useSelector } from "react-redux";

function ReportModal({ comicId, onClose }) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector((state) => state.auth.login?.user);

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
      const response = await apiMain.createReport(
        user,
        {
          comicId,
          userId: user.id,
          reason,
          status: "PENDING"
        },
        null, // Không cần dispatch nếu không cập nhật state
        null  // Không cần stateSuccess callback
      );
      
      if (response) {
        toast.success("Gửi báo cáo thành công");
        onClose();
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      if (error.message.includes("Invalid token") || error.message.includes("Token expired")) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
      } else {
        toast.error("Gửi báo cáo thất bại: " + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Báo cáo truyện</h3>
        <textarea
          className="report-textarea"
          placeholder="Nhập lý do báo cáo..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="modal-actions">
          <button 
            className="btn-outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportModal;