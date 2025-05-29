// PremiumPage/index.jsx
import React from "react";
import "./styles.scss";
import PlanCard from "./component/PlanCard/index.jsx";
import { Crown } from "lucide-react";
import { useSelector } from "react-redux";

const PremiumPage = () => {
    const premiumExpiredAt = useSelector((state) => state.userStats.data).premiumExpiredAt;


    // Tính số ngày còn lại
    let remainDays = 0;
    if (premiumExpiredAt) {
        const now = new Date();
        const expired = new Date(premiumExpiredAt);
        const diffTime = expired - now;
        remainDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
    return (
        <div className="premium-container">
            <div className="premium-card">
                <h2 className="premium-title">
                    <Crown size={28} className="icon" />
                    Nâng cấp tài khoản Premium
                </h2>

                <div className="premium-remaining">
                    {remainDays > 0 ? (
                        <span>
                            🎫 Bạn còn <strong>{remainDays}</strong> ngày Premium
                        </span>
                    ) : (
                        <span>Chưa đăng ký Premium</span>
                    )}
                </div>

                <div className="plan-options">
                    <PlanCard days={7} cost={100} />
                    <PlanCard days={30} cost={300} bestChoice />
                </div>

                <div className="benefits">
                    <h3>🎁 Quyền lợi khi nâng cấp Premium:</h3>
                    <ul>
                        <li>Đăng truyện <strong>không giới hạn</strong></li>
                        <li>Sử dụng <strong>OCR</strong> khi đọc truyện</li>
                        <li>Huy hiệu <strong>VIP</strong> cạnh tên người dùng</li>
                        <li>Nhận thêm <strong>10% kim cương</strong> khi hoàn thành nhiệm vụ</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PremiumPage;
