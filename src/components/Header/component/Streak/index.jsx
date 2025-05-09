import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserStats, addDiamondApi } from '../../../../api/userStatsApi';
import { setStreak, setDiamonds, setReward } from '../../../../redux/slice/streak';
import './styles.scss';
import { loginSuccess } from '../../../../redux/slice/auth';
import { updateUserStats } from '../../../../redux/slice/userStats';

export default function StreakRewards() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.user);
    const userStats = useSelector((state) => state.userStats?.data);
    const currentStreak = userStats?.currentStreak || 0;
    const longestStreak = userStats?.longestStreak || 0;
    const userDiamond = userStats?.diamond || 0;
    const [popoverVisible, setPopoverVisible] = useState(false);

    // Hàm tiện ích để cộng kim cương
    const addDiamond = async (amount) => {
        try {
            const payload = {
                userId: user.id,
                diamond: amount,
            };
            const response = await addDiamondApi(payload, user, dispatch, loginSuccess); // Gọi API backend
            const newUserStats = response.data;
            dispatch(updateUserStats(newUserStats)); // Cập nhật số kim cương trong Redux
        } catch (error) {
            console.error('Error adding diamonds:', error);
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
                        {currentStreak} 🔥
                    </div>
                    <div className="diamonds">
                        💎 {userDiamond}
                    </div>
                    {popoverVisible && (
                        <div className="streak-popover">
                            <h3>Chuỗi Streak</h3>
                            <p>Chuỗi hiện tại: {currentStreak} ngày</p>
                            <p>Chuỗi dài nhất: {longestStreak} ngày</p>
                            <ul>
                                {/* <li>
                                    7 ngày: {streakRewards[7] ? '✅ Đã nhận' : '❌ Chưa nhận'}
                                </li>
                                <li>
                                    17 ngày: {streakRewards[17] ? '✅ Đã nhận' : '❌ Chưa nhận'}
                                </li>
                                <li>
                                    30 ngày: {streakRewards[30] ? '✅ Đã nhận' : '❌ Chưa nhận'}
                                </li> */}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}