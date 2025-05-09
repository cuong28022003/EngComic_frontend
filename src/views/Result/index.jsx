import { useLocation, useNavigate } from "react-router-dom";
import "./styles.scss";
import { addXp } from "../../api/userStatsApi";
import { useSelector } from "react-redux";
import { loginSuccess } from "../../redux/slice/auth";
import { useEffect, useState } from "react";
import StreakPopup from "../../components/StreakPopup";
import XpPopup from "../../components/XpPopup";
import { getUserStats } from "../../api/userStatsApi";
import { useDispatch } from "react-redux";
import { set } from "lodash";

const ResultPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const results = state?.reviewResults || [];

    const countByType = (type) =>
        results.filter(r => r.reviewState === type).length;

    // Lọc các thẻ người dùng trả lời sai
    const incorrectCards = results.filter(
        (r) => r.correct === false
    );

    const calculateXp = () => {
        let baseXp = 0;

        results.forEach(result => {
            baseXp += result.correct ? 10 : 5;
        });

        // Bonus theo số lượng thẻ
        const bonusXp = results.length >= 15
            ? 15
            : results.length >= 10
                ? 10
                : results.length >= 5
                    ? 5
                    : 0;

        return baseXp + bonusXp;
    };

    const totalXp = calculateXp();

    const [showStreakPopup, setShowStreakPopup] = useState(true);
    const [showXpPopup, setShowXpPopup] = useState(false);
    const [oldUserStats, setOldUserStats] = useState(null);
    const [userStats, setUserStats] = useState(null);

    useEffect(() => {
        const fetchOldUserStats = async () => {
            try {
                const response = await getUserStats(user.id, user, dispatch, loginSuccess);
                const data = response.data;
                setOldUserStats(data);

                // Kiểm tra nếu lastStudyDate là ngày hôm nay
                const today = new Date().toISOString().split("T")[0]; // Lấy ngày hôm nay (YYYY-MM-DD)
                const lastStudyDate = data?.lastStudyDate?.split("T")[0]; // Lấy ngày từ lastStudyDate
                if (lastStudyDate === today) {
                    setShowStreakPopup(false); // Không hiển thị StreakPopup
                    setShowXpPopup(true); // Hiển thị XpPopup ngay lập tức
                }
            } catch (error) {
                console.error('Failed to fetch user stats:', error);
            }
        };

        const fetchUpdatedUserStats = async () => {
            try {
                const response = await getUserStats(user.id, user, dispatch, loginSuccess);
                const data = response.data;
                setUserStats(data);
            } catch (error) {
                console.error('Failed to fetch user stats:', error);
            }
        };

        const fetchData = async () => {
            await fetchOldUserStats();
            if (totalXp > 0) {
                const payload = {
                    userId: user.id,
                    xp: totalXp,
                };
                await addXp(payload, user, loginSuccess);
            }
            await fetchUpdatedUserStats();
            setLoading(false); // Dữ liệu đã được tải xong
        };

        fetchData();
    }, [totalXp]);

    if (loading) {
        return <div>Loading...</div>; // Hoặc một spinner/loading component
    }

    return (
        <>
            <div className="result-page">
                <h2>🎉 You've finished your session!</h2>
                <p>Total Cards Reviewed: <strong>{results.length}</strong></p>
                <p>Total XP Earned: <strong>{totalXp}</strong></p>

                <div className="stats">
                    <p>🟥 Again: {countByType("AGAIN")}</p>
                    <p>🟧 Hard: {countByType("HARD")}</p>
                    <p>🟩 Good: {countByType("GOOD")}</p>
                    <p>🟦 Easy: {countByType("EASY")}</p>
                </div>

                <div className="card-results">
                    {incorrectCards.map((r, idx) => (
                        <div key={idx} className="card-result">
                            <div><strong>Q:</strong> {r.front}</div>
                            <div><strong>Your Answer:</strong> {r.userAnswer}</div>
                            <div><strong>Correct Answer:</strong> {r.back}</div>
                            <div><strong>Review:</strong> {r.reviewState}</div>
                        </div>
                    ))}
                </div>

                <button onClick={() => navigate("/")}>🔁 Back to Home</button>
            </div>

            {/* Hiển thị StreakPopup */}
            {showStreakPopup && (
                <StreakPopup
                    streak={userStats.currentStreak || 0}
                    onDone={() => setShowXpPopup(true)} // Hiển thị XpPopup sau khi StreakPopup biến mất
                />
            )}

            {/* Hiển thị XpPopup */}
            {showXpPopup && (
                <XpPopup
                    oldUserStats={oldUserStats}
                    userStats={userStats}
                    onDone={() => setShowXpPopup(false)}
                />
            )}
        </>
    );
};

export default ResultPage;
