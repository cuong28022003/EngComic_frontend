import { useLocation, useNavigate } from "react-router-dom";
import "./styles.scss";
import { addXp, addDiamondApi } from "../../api/userStatsApi";
import { useSelector } from "react-redux";
import { loginSuccess } from "../../redux/slice/auth";
import { useEffect, useState } from "react";
import StreakPopup from "../../components/StreakPopup";
import XpPopup from "../../components/XpPopup";
import { getUserStats } from "../../api/userStatsApi";
import { useDispatch } from "react-redux";
import { updateUserStats } from "../../redux/slice/userStats";
import { checkAndUseSkill } from "../../api/characterUsageApi";
import { routeLink } from "../../routes/AppRoutes";
import Loading from "../../components/Loading/Loading";

const skillNameMap = {
    SHOW_ANSWER: "LẬT ĐÁP ÁN",
    DOUBLE_XP: "NHÂN ĐÔI XP",
    // Thêm các kỹ năng khác nếu có
};

const ResultPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.user);
    const selectedCharacters = useSelector((state) => state.character.selectedCharacters);
    // console.log("Selected Characters:", selectedCharacters);
    const activeSkills = useSelector((state) => state.character.activeSkills);
    console.log("Active Skills:", activeSkills);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const results = state?.reviewResults || [];
    const sessionId = state?.sessionId;

    const countByType = (type) =>
        results.filter(r => r.reviewState === type).length;

    // Lọc các thẻ người dùng trả lời sai
    const incorrectCards = results.filter(
        (r) => r.correct === false
    );

    const [baseXp, setBaseXp] = useState(0);
    const [bonusXpFromSessionLength, setBonusXpFromSessionLength] = useState(0);
    const [bonusXpFromCharacters, setBonusXpFromCharacters] = useState(0);
    const [isDoubleXp, setIsDoubleXp] = useState(false);
    const [bonusDiamond, setBonusDiamond] = useState(0);
    const [totalXp, setTotalXp] = useState(0);
    console.log("Total XP:", totalXp);
    console.log("Bonus XP from Characters:", bonusXpFromCharacters);
    console.log("Is Double XP:", isDoubleXp);
    console.log("Bonus Diamond:", bonusDiamond);

    const calculateTotalXpWithCharacterBonus = async () => {
        let baseXp = 0;

        results.forEach(result => {
            baseXp += result.correct ? 10 : 5;
        });

        // Bonus XP theo số lượng thẻ đã học
        const bonusXpFromSessionLength =
            results.length >= 15 ? 15 :
                results.length >= 10 ? 10 :
                    results.length >= 5 ? 5 : 0;

        let bonusXpFromCharacters = 0;
        let isDoubleXp = false;
        let bonusDiamond = 0;

        // Lấy ngày hôm nay theo định dạng yyyy-MM-dd
        const today = new Date().toISOString().slice(0, 10);

        for (const skillObj of activeSkills) {
            const skill = skillObj.skill;
            const char = skillObj.character;
            if (!char) continue; // Bỏ qua nếu char là null hoặc undefined
            bonusXpFromCharacters += char.bonusXp;

            if (skill === "DOUBLE_XP") {
                const payload = {
                    userId: user.id,
                    characterId: char.id,
                    skill: "DOUBLE_XP",
                    date: today,
                }
                const response = await checkAndUseSkill(payload, user, dispatch, loginSuccess);
                isDoubleXp = true;
            }

            if (skill === "BONUS_DIAMOND" && char.rarity === "SSR") {
                const payload = {
                    userId: user.id,
                    characterId: char.id,
                    skill: "BONUS_DIAMOND",
                    date: today,
                }
                const response = await checkAndUseSkill(payload, user, dispatch, loginSuccess);
                bonusDiamond += char.bonusDiamond || 0; // hoặc giá trị mặc định
            }

            if (skill === "SHOW_ANSWER") {
                const payload = {
                    userId: user.id,
                    characterId: char.id,
                    skill: "SHOW_ANSWER",
                    date: today,
                }
                const response = await checkAndUseSkill(payload, user, dispatch, loginSuccess);
            }
        }

        setBaseXp(baseXp);
        setBonusXpFromSessionLength(bonusXpFromSessionLength);
        setBonusXpFromCharacters(bonusXpFromCharacters);
        setIsDoubleXp(isDoubleXp);
        setBonusDiamond(bonusDiamond);

        let totalXp = baseXp + bonusXpFromSessionLength + bonusXpFromCharacters;
        if (isDoubleXp) totalXp *= 2;
        setTotalXp(totalXp);

        return {
            baseXp,
            bonusXpFromSessionLength,
            bonusXpFromCharacters,
            isDoubleXp,
            bonusDiamond,
            totalXp
        };
    };

    const [showXpPopup, setShowXpPopup] = useState(true);
    const dataUserStats = useSelector((state) => state.userStats?.data);
    console.log("Data User Stats:", dataUserStats);
    const [oldUserStats, setOldUserStats] = useState(null);
    const [userStats, setUserStats] = useState(null);
    console.log("oldUserStats:", oldUserStats);
    console.log("User Stats:", userStats);

    const hasSessionBeenHandled = (sessionId) => {
        const handledSessions = JSON.parse(localStorage.getItem("handledSessions") || "[]");
        return handledSessions.includes(sessionId);
    };

    const markSessionHandled = (sessionId) => {
        const handledSessions = JSON.parse(localStorage.getItem("handledSessions") || "[]");
        handledSessions.push(sessionId);
        localStorage.setItem("handledSessions", JSON.stringify(handledSessions));
    };


    useEffect(() => {
        if (!results.length || !sessionId) {
            navigate("/");
        }
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            if (!sessionId || hasSessionBeenHandled(sessionId)) {
                console.log("Session already handled or missing.");
                navigate(routeLink.home)
                return;
            }

            setOldUserStats(dataUserStats);

            const {
                baseXp,
                bonusXpFromSessionLength,
                bonusXpFromCharacters,
                isDoubleXp,
                bonusDiamond,
                totalXp,
            } = await calculateTotalXpWithCharacterBonus(); // sửa hàm này trả về object

            // Cập nhật state sau khi đã có dữ liệu
            setBaseXp(baseXp);
            setBonusXpFromSessionLength(bonusXpFromSessionLength);
            setBonusXpFromCharacters(bonusXpFromCharacters);
            setIsDoubleXp(isDoubleXp);
            setBonusDiamond(bonusDiamond);
            setTotalXp(totalXp);

            if (totalXp > 0) {
                const payload = {
                    userId: user.id,
                    xp: totalXp,
                };
                const response = await addXp(payload, user, loginSuccess);
                console.log("Response:", response);
                if (bonusDiamond > 0) {
                    const diamondPayload = {
                        userId: user.id,
                        diamond: bonusDiamond,
                    };
                    await addDiamondApi(diamondPayload, user, loginSuccess);
                }
                const newUserStats = response.data;
                setUserStats(newUserStats);
                dispatch(updateUserStats(newUserStats)); // Cập nhật Redux
            }
            markSessionHandled(sessionId); // Đánh dấu phiên đã được xử lý
            setLoading(false); // Dữ liệu đã được tải xong


        };

        fetchData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <div className="result-page">
                <h2>🎉 Bạn đã hoàn thành phiên học!</h2>
                <div className="xp-summary">
                    <p>Tổng số thẻ đã ôn: <strong>{results.length}</strong></p>
                    <p>XP từ câu trả lời: <strong>{baseXp}</strong></p>
                    <p>XP thưởng theo độ dài phiên: <strong>{bonusXpFromSessionLength}</strong></p>
                    <p>XP thưởng từ nhân vật: <strong>{bonusXpFromCharacters}</strong></p>
                    <p className="total-xp">
                        <strong>Tổng XP nhận được: </strong>
                        {isDoubleXp ? (
                            <span>
                                <s>{baseXp + bonusXpFromSessionLength + bonusXpFromCharacters}</s> <strong>{totalXp}</strong> (NHÂN ĐÔI XP)
                            </span>
                        ) : (
                            <strong>{totalXp}</strong>
                        )}
                    </p>
                    {bonusDiamond > 0 && <p className="bonus-diamond">💎 Kim cương thưởng: <strong>{bonusDiamond}</strong></p>}
                </div>
                {activeSkills.length > 0 && (
                    <div className="skills-used">
                        <h4>Kỹ năng đã sử dụng:</h4>
                        <ul>
                            {activeSkills.map((item, idx) => (
                                <li key={idx}>
                                    <strong>{skillNameMap[item.skill] || item.skill}</strong> - Nhân vật: <strong>{item.character.name}</strong>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

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
                            <div><strong>Câu trả lời của bạn:</strong> {r.userAnswer}</div>
                            <div><strong>Đáp án đúng:</strong> {r.back}</div>
                            <div><strong>Đánh giá:</strong> {r.reviewState}</div>
                        </div>
                    ))}
                </div>

                <button onClick={() => navigate("/")}>🔁 Quay về Deck</button>
            </div>

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
