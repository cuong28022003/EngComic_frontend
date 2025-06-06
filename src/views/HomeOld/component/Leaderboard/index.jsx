import './styles.scss';
import { useEffect, useState } from 'react';
import { getLeaderboard } from '../../../../api/userStatsApi';
import { routeLink } from '../../../../routes/AppRoutes';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
    const [fullInfoUsers, setFullInfoUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getLeaderboard(10)
            .then(res => setFullInfoUsers(res.data.content))
            .catch(err => console.error(err));
    }, []);

    const handleUserClick = (userId) => {
        navigate(routeLink.userAccount.replace(":userId", userId)); // Chuyển hướng đến trang Rank của người dùng
    };

    return (
        <div className="leaderboard">
            <h3>🏆 Top Users</h3>
            <ul>
                {fullInfoUsers.map((data, index) => (
                    <li key={index} onClick={() => handleUserClick(data?.user?.id)}>
                        <span className="rank">{index + 1}</span>
                        <img
                            src={data?.userStats?.rank?.badge}
                            alt={data?.userStats?.rank?.name}
                            className="badge-icon"
                        />
                        <span className="name">{data?.user?.username}</span>
                        <span className="xp">{data?.userStats?.xp} XP</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
