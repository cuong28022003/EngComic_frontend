import React, { useEffect, useState } from 'react';
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
            dispatch(updateStreakRewards({ [streak]: true })); // Đánh dấu đã nhận thưởng
        } catch (error) {
            console.error('Error claiming reward:', error);
        }
    };

    const togglePopover = () => {
        setPopoverVisible((prev) => !prev);
    };

    return (
        <div className="streak-rewards">
            {user && (
                <div className="streak-container" onClick={togglePopover}>
                    <div className="streak">
                        {isFlameActive ? (
                            <Lottie animationData={fireAnimation} loop={true} className="fire-animation" />
                        ) : (
                            <Lottie animationData={smokeAnimation} loop={true} className="smoke-animation" />
                        )}
                        <span>{currentStreak}</span>
                    </div>
                    {popoverVisible && (
                        <div className="streak-popover">
                            <h3>Chuỗi Streak</h3>
                            <p>Chuỗi hiện tại: {currentStreak} ngày</p>
                            <p>Chuỗi dài nhất: {longestStreak} ngày</p>
                            <ul>
                                {rewards.map((reward) => (
                                    <li key={reward.streak}>
                                        Mốc {reward.streak} ngày:
                                        {streakRewards[reward.streak] ? (
                                            <span> Đã nhận</span>
                                        ) : (
                                            currentStreak >= reward.streak && (
                                                <button
                                                    onClick={() =>
                                                        claimReward(reward.streak, reward.diamonds)
                                                    }
                                                >
                                                    Nhận {reward.diamonds} 💎
                                                </button>
                                            )
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}