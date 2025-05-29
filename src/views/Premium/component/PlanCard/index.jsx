// PremiumPage/PlanCard.jsx
import React from "react";
import "./styles.scss";
import { Gem } from "lucide-react";
import { useSelector } from "react-redux";
import { upgradePremium } from "../../../../api/userStatsApi";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../../redux/slice/auth";
import { toast } from "react-toastify";
import { updateUserStats } from "../../../../redux/slice/userStats";
import ConfirmDialog from "../../../../components/ConfirmDialog";
import { useState } from "react";

const PlanCard = ({ days, cost, bestChoice }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.user);

    const [showConfirm, setShowConfirm] = useState(false);
    
    const handleUpgrade = async() => {
        try {
            const payload = {
                userId: user.id,
                days: days,
                cost: cost,
            };
            const response = await upgradePremium(payload, user, dispatch, loginSuccess);
            const data = response.data;
            dispatch(updateUserStats(data));
            toast.success("🎉 Nâng cấp Premium thành công!");
        } catch (error) {
            console.error("Error upgrading plan:", error);
            toast.error("❌ Nâng cấp thất bại!");
            
        }
    }

    const handleBuyClick = () => {
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        handleUpgrade();
    };

    const handleCancel = () => {
        setShowConfirm(false);
    };

    return (
        <div className={`plan-card ${bestChoice ? "highlight" : ""}`}>
            {bestChoice && <div className="badge">Tiết kiệm 100💎</div>}
            <h4>{days} ngày</h4>
            <p className="cost">
                <Gem size={18} className="gem-icon" /> {cost} kim cương
            </p>
            <button className="buy-button" onClick={handleBuyClick}>Nâng cấp</button>
            {showConfirm && (
                <ConfirmDialog
                    message={`Bạn có chắc chắn muốn nâng cấp gói ${days} ngày với ${cost} kim cương?`}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default PlanCard;
    