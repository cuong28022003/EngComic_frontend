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

const ResultPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.user);
    const selectedCharacters = useSelector((state) => state.characterSelection.selectedCharacters);
    console.log("Selected Characters:", selectedCharacters);
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
    const [usedSkillsDetail, setUsedSkillsDetail] = useState([]); // [{skill, character}]
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
        let usedSkillsDetail = [];

        // Lấy ngày hôm nay theo định dạng yyyy-MM-dd
        const today = new Date().toISOString().slice(0, 10);

        // Đảm bảo mỗi skill chỉ được kích hoạt 1 lần
        const usedSkills = new Set();

        for (const char of selectedCharacters) {
            if (!char) continue; // Bỏ qua nếu char là null hoặc undefined
            bonusXpFromCharacters += char.bonusXp;

            if (char.skillsUsagePerDay &&
                char.skillsUsagePerDay["DOUBLE_XP"] &&
                !usedSkills.has("DOUBLE_XP")) {
                const payload = {
                    userId: user.id,
                    characterId: char.id,
                    skill: "DOUBLE_XP",
                    date: today,
                }
                const response = await checkAndUseSkill(payload, user, dispatch, loginSuccess);
                const data = response.data;
                if (data.canUse) {
                    usedSkills.add("DOUBLE_XP");
                    isDoubleXp = true;
                    usedSkillsDetail.push({ skill: "DOUBLE_XP", character: char });
                }
            }

            if (char.skillsUsagePerDay &&
                char.skillsUsagePerDay["BONUS_DIAMOND"] &&
                char.rarity === "SSR" &&
                !usedSkills.has("BONUS_DIAMOND")) {
                const payload = {
                    userId: user.id,
                    characterId: char.id,
                    skill: "BONUS_DIAMOND",
                    date: today,
                }
                const response = await checkAndUseSkill(payload, user, dispatch, loginSuccess);
                const data = response.data;
                if (data.canUse) {
                    usedSkills.add("BONUS_DIAMOND");
                    bonusDiamond += char.bonusDiamond || 0; // hoặc giá trị mặc định
                    usedSkillsDetail.push({ skill: "BONUS_DIAMOND", character: char });
                }
            }
        }

        setBaseXp(baseXp);
        setBonusXpFromSessionLength(bonusXpFromSessionLength);
        setBonusXpFromCharacters(bonusXpFromCharacters);
        setIsDoubleXp(isDoubleXp);
        setBonusDiamond(bonusDiamond);
        setUsedSkillsDetail(usedSkillsDetail);

        let totalXp = baseXp + bonusXpFromSessionLength + bonusXpFromCharacters;
        if (isDoubleXp) totalXp *= 2;
        setTotalXp(totalXp);
            
        return {
            baseXp,
            bonusXpFromSessionLength,
            bonusXpFromCharacters,
            isDoubleXp,
            bonusDiamond,
            totalXp,
            usedSkillsDetail
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
                usedSkillsDetail
            } = await calculateTotalXpWithCharacterBonus(); // sửa hàm này trả về object

            // Cập nhật state sau khi đã có dữ liệu
            setBaseXp(baseXp);
            setBonusXpFromSessionLength(bonusXpFromSessionLength);
            setBonusXpFromCharacters(bonusXpFromCharacters);
            setIsDoubleXp(isDoubleXp);
            setBonusDiamond(bonusDiamond);
            setUsedSkillsDetail(usedSkillsDetail);
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
        return <div>Loading...</div>; // Hoặc một spinner/loading component
    }

    return (
        <>
            <div className="result-page">
                <h2>🎉 You've finished your session!</h2>
                <p>Total Cards Reviewed: <strong>{results.length}</strong></p>
                <div className="xp-summary">
                    <p>XP from answers: <strong>{baseXp}</strong></p>
                    <p>Bonus XP from session length: <strong>{bonusXpFromSessionLength}</strong></p>
                    <p>Bonus XP from characters: <strong>{bonusXpFromCharacters}</strong></p>
                    <p className="total-xp">
                        <strong>Total XP Earned: </strong>
                        {isDoubleXp ? (
                            <span>
                                <s>{baseXp + bonusXpFromSessionLength + bonusXpFromCharacters}</s> <strong>{totalXp}</strong> (DOUBLE XP)
                            </span>
                        ) : (
                            <strong>{totalXp}</strong>
                        )}
                    </p>
                    {bonusDiamond > 0 && <p className="bonus-diamond">💎 Bonus Diamonds: <strong>{bonusDiamond}</strong></p>}
                </div>
                {usedSkillsDetail.length > 0 && (
                    <div className="skills-used">
                        <h4>Skills Used:</h4>
                        <ul>
                            {usedSkillsDetail.map((item, idx) => (
                                <li key={idx}>
                                    <strong>{item.skill}</strong> - Character: <strong>{item.character.name}</strong>
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
                            <div><strong>Your Answer:</strong> {r.userAnswer}</div>
                            <div><strong>Correct Answer:</strong> {r.back}</div>
                            <div><strong>Review:</strong> {r.reviewState}</div>
                        </div>
                    ))}
                </div>

                <button onClick={() => navigate("/")}>🔁 Back to Home</button>
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
