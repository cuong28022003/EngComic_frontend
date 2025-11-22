import React from "react";
import "./styles.scss";
import { useEffect, useState } from "react";
import { getLeaderboard } from "../../api/userStatsApi";
import { routeLink } from "../../routes/AppRoutes";
import { useNavigate } from "react-router-dom";
import Avatar from "../../components/Avatar";
import Pagination from "../../components/Pagination/index.jsx";
import { set } from "lodash";
import Loading from "../../components/Loading/index.jsx";

const mockLeaderboard = [
    { fullName: "Alice Nguyen", avatar: "/avatars/alice.png", badge: "Diamond", xp: 12000, longestStreak: 45 },
    { fullName: "Bob Tran", avatar: "/avatars/bob.png", badge: "Platinum", xp: 11500, longestStreak: 42 },
    { fullName: "Charlie Pham", avatar: "/avatars/charlie.png", badge: "Gold", xp: 11000, longestStreak: 39 },
    { fullName: "Daisy Le", avatar: "/avatars/daisy.png", badge: "Silver", xp: 9500, longestStreak: 30 },
    { fullName: "Ethan Vu", avatar: "/avatars/ethan.png", badge: "Bronze", xp: 8800, longestStreak: 28 },
];

const getRankClass = (index) => {
    if (index === 0) return "rank-1";
    if (index === 1) return "rank-2";
    if (index === 2) return "rank-3";
    return "";
};

const LeaderboardPage = () => {
    const [topUsers, setTopUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true); // Bắt đầu tải dữ liệu
        const params = {
            page: currentPage - 1, // API uses 0-based index for pages
            size: 3, // Number of users per page
        };
        getLeaderboard(params)
            .then(res => {
                setTopUsers(res.data.content)
                setTotalPages(res.data.totalPages || 1);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false)); // Kết thúc tải dữ liệu
    }, [currentPage]);

    const handleUserClick = (userId) => {
        navigate(routeLink.userAccount.replace(":userId", userId)); // Chuyển hướng đến trang Rank của người dùng
    };

    if (loading) return <Loading />; // Hiển thị loading khi đang tải dữ liệu

    return (
        <div className="leaderboard-container">
            <h1 className="title">🏆 Bảng Xếp Hạng Người Dùng</h1>
            <div className="leaderboard-list">
                {topUsers.map((user, index) => {
                    const globalRank = (currentPage - 1) * 3 + index; // 3 là size mỗi trang
                    return (
                        <div className={`leaderboard-card ${getRankClass(globalRank)}`}
                            key={index}
                            onClick={() => handleUserClick(user.user.id)}
                        >
                            <div className="rank">#{globalRank + 1}</div>
                            <Avatar
                                src={user?.user?.imageUrl}
                                userStats={user?.userStats}
                                size={70}
                            />
                            <div className="user-info">
                                <div className="name">{user.user.fullName}</div>
                                <div className={`badge badge-${user.userStats.rank.name.toLowerCase()}`}>{user.userStats.rank.name}</div>
                            </div>
                            <div className="stats">
                                <div className="xp">✨ {user.userStats.xp.toLocaleString()} XP</div>
                                <div className="streak">🔥 {user.userStats.longestStreak} ngày</div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default LeaderboardPage;
