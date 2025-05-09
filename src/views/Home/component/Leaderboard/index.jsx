import './styles.scss';
import { useEffect, useState } from 'react';
import { getLeaderboard } from '../../../../api/userStatsApi';
import { routeLink } from '../../../../routes/AppRoutes';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getLeaderboard(10)
            .then(res => setUsers(res.data.content))
            .catch(err => console.error(err));
    }, []);

    const handleUserClick = (userId) => {
        navigate(routeLink.userRank.replace(":userId", userId)); // Chuyển hướng đến trang Rank của người dùng
    };

    return (
        <div className="leaderboard">
            <h3>🏆 Top Users</h3>
            <ul>
                {users.map((user, index) => (
                    <li key={user.username} onClick={() => handleUserClick(user.id)}>
                        <span className="rank">{index + 1}</span>
                        <img
                            src={user.rankImage}
                            alt={user.rankName}
                            className="badge-icon"
                        />
                        <span className="name">{user.username}</span>
                        <span className="xp">{user.xp} XP</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
