import { useEffect, useState } from 'react';
import './styles.scss';

const XpPopup = ({ oldUserStats, userStats, onDone }) => {
    console.log("oldUserStats", oldUserStats);
    console.log("userStats", userStats);
    const [currentXp, setCurrentXp] = useState(oldUserStats?.xp);
    const [currentRank, setCurrentRank] = useState(oldUserStats?.rank);
    const [targetXp] = useState(userStats?.xp);
    const [isRankUp, setIsRankUp] = useState(false);

    useEffect(() => {
        const animateXp = async () => {
            let start = oldUserStats?.xp || 0;
            let end = targetXp;
            let rankUpAt = oldUserStats?.rank.maxXp;
            const step = Math.ceil((end - start) / 100); // smoothness
            const interval = setInterval(() => {
                start += step;

                // Rank Up Trigger
                if (!isRankUp && start >= rankUpAt) {
                    setCurrentRank(userStats.rank);
                    setIsRankUp(true);
                }

                if (start >= end) {
                    setCurrentXp(end);
                    clearInterval(interval);
                    // Thêm thời gian chờ 2 giây trước khi gọi onDone
                    setTimeout(() => {
                        onDone?.();
                    }, 2000); // 2000ms = 2 giây
                } else {
                    setCurrentXp(start);
                }
            }, 50);
        };

        animateXp();
    }, []);

    const { minXp, maxXp, badge, name } = currentRank;
    const progress = Math.min(1, (currentXp - minXp) / (maxXp - minXp));

    return (
        <div className="xp-popup">
            <div className="badge-section">
                <img src={badge} alt={name} className="badge" />
                <div className="rank-name">{name}</div>
                {isRankUp && <div className="rank-up">🎉 Rank Up!</div>}
            </div>
            <div className="xp-bar-container">
                <div className="xp-bar" style={{ width: `${progress * 100}%` }} />
            </div>
            <div className="xp-text">{currentXp} / {maxXp} XP</div>
        </div>
    );
};

export default XpPopup;
