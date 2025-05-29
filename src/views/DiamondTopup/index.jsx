// DiamondTopupPage/index.jsx
import React from "react";
import TopupCard from "./component/TopupCard";
import "./styles.scss";
import { Gem } from "lucide-react";
import { use } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { routeLink } from "../../routes/AppRoutes";

const DiamondTopupPage = () => {
    const navigate = useNavigate();
    const userStats = useSelector((state) => state.userStats.data);
    const currentDiamonds = userStats?.diamond; // nên lấy từ API hoặc context

    return (
        <div className="diamond-topup-page">
            <h2 className="title">Nạp kim cương</h2>
            <div className="current-diamonds">
                Bạn đang có <Gem size={20} /> <b>{currentDiamonds}</b> kim cương
            </div>

            <button
                className="topup-history-btn"
                onClick={() => navigate(routeLink.topupHistory)}
            >
                Xem lịch sử yêu cầu nạp
            </button>

            <div className="topup-grid">
                <TopupCard diamonds={100} price={20000} />
                <TopupCard diamonds={250} price={50000} bonus={20} />
                <TopupCard diamonds={500} price={100000} bonus={80} popular />
                <TopupCard diamonds={1000} price={200000} bonus={200} bestValue />
            </div>

            <p className="note">⚠️ Nạp kim cương là không hoàn lại. Mọi thắc mắc vui lòng liên hệ hỗ trợ.</p>
        </div>
    );
};

export default DiamondTopupPage;
