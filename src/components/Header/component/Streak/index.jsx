import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addDiamondApi } from '../../../../api/userStatsApi';
import { loginSuccess } from '../../../../redux/slice/auth';
import { updateUserStats } from '../../../../redux/slice/userStats';
import { updateStreakRewards } from '../../../../redux/slice/reward';
import './styles.scss';
import Lottie from "lottie-react";
import fireAnimation from "../../../../assets/lottie/fire.json";
import smokeAnimation from "../../../../assets/lottie/smoke.json";

export default function StreakRewards() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.user);
    const userStats = useSelector((state) => state.userStats?.data);
    const streakRewards = useSelector((state) => state.reward?.streakRewards);
    const currentStreak = userStats?.currentStreak || 0;
    const longestStreak = userStats?.longestStreak || 0;
    const userDiamond = userStats?.diamond || 0;
    const lastStudyDate = userStats?.lastStudyDate || null; // Ngày học cuối cùng
    const [popoverVisible, setPopoverVisible] = useState(false);
    const popoverRef = useRef(null);

    const rewards = [
        { streak: 7, diamonds: 20 },
        { streak: 14, diamonds: 40 },
        { streak: 30, diamonds: 100 },
    ];

    // Kiểm tra nếu lastStudyDate là ngày hôm nay
    const isToday = (date) => {
        const today = new Date();
        const targetDate = new Date(date);
        return (
            today.getFullYear() === targetDate.getFullYear() &&
            today.getMonth() === targetDate.getMonth() &&
            today.getDate() === targetDate.getDate()
        );
    };

    // Hàm lấy ngày hiện tại dạng "YYYY-MM-DD"
    const getTodayString = () => {
        const today = new Date();
        return today.toISOString().slice(0, 10);
    };

    const todayString = getTodayString();

    const isFlameActive = lastStudyDate && isToday(lastStudyDate); // Ngọn lửa cháy nếu ngày học cuối là hôm nay

    // Hàm tiện ích để cộng kim cương và cập nhật trạng thái nhận thưởng
    const claimReward = async (streak, diamonds) => {
        try {
            const payload = {
                userId: user.id,
                diamond: diamonds,
            };
            const response = await addDiamondApi(payload, user, dispatch, loginSuccess); // Gọi API backend
            const newUserStats = response.data;
            dispatch(updateUserStats(newUserStats)); // Cập nhật số kim cương trong Redux
            dispatch(updateStreakRewards({ [streak]: todayString })); // Đánh dấu đã nhận thưởng
        } catch (error) {
            console.error('Error claiming reward:', error);
        }
    };


    const togglePopover = (e) => {
        e.stopPropagation();
        setPopoverVisible(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target)) {
                setPopoverVisible(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="streak-rewards">
            {user && (
                <div className="streak-container" >
                    <div className="streak" onClick={togglePopover}>
                        {isFlameActive ? (
                            <Lottie animationData={fireAnimation} loop={true} className="fire-animation" />
                        ) : (
                            <Lottie animationData={smokeAnimation} loop={true} className="smoke-animation" />
                        )}
                        <span>{currentStreak}</span>
                    </div>
                    {popoverVisible && (
                        <div className="streak-popover" ref={popoverRef}>
                            <div className="streak-popover-header">
                                <h3>Chuỗi Streak</h3>
                            </div>
                            <div className="streak-popover-info">
                                <div>
                                    <span>Hiện tại:</span>
                                    <strong>{currentStreak} ngày</strong>
                                </div>
                                <div>
                                    <span>Dài nhất:</span>
                                    <strong>{longestStreak} ngày</strong>
                                </div>
                            </div>
                            <ul className="streak-popover-rewards">
                                {rewards.map((reward) => {
                                    const lastClaimedDate = streakRewards[reward.streak]; // dạng "YYYY-MM-DD" hoặc null
                                    const claimedToday = lastClaimedDate === todayString;
                                    const canClaim = currentStreak >= reward.streak && !claimedToday;
                                    return (
                                        <li key={reward.streak}>
                                            <span className="reward-streak">🎯 {reward.streak} ngày</span>
                                            {claimedToday ? (
                                                <span className="reward-claimed">Đã nhận</span>
                                            ) : (
                                                <button
                                                    className={`reward-claim-btn${canClaim ? '' : ' disabled'}`}
                                                    onClick={() => canClaim && claimReward(reward.streak, reward.diamonds)}
                                                    disabled={!canClaim}
                                                >
                                                    Nhận {reward.diamonds} 💎
                                                </button>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}