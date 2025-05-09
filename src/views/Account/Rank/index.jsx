import { useEffect, useState } from 'react';
import { getUserStats } from '../../../api/userStatsApi';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../../redux/slice/auth';

const Rank = () => {
    const user = useSelector(state => state.auth.login?.user);
    const dispatch = useDispatch();
    const [stats, setStats] = useState(null);
    const [rank, setRank] = useState(null);
    const xp = stats?.xp || 0;
    const current = xp - rank?.minXp;
    const total = rank?.maxXp - rank?.minXp;
    const percent = Math.floor((current / total) * 100);


    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const response = await getUserStats(user.id, user, dispatch, loginSuccess);
                const data = response.data;
                setStats(data);
                setRank(data.rank);
            } catch (error) {
                console.error("Error fetching user stats:", error);
            }
        }
        fetchUserStats();
    }, [user]);

    if (!stats) return <p>Loading rank...</p>;

    return (
        <div className="rank-container">
            <img src={rank?.badge} alt="badge" className="badge" />
            <div className="info">
                <h3>{rank?.name}</h3>
                <div className="progress-bar">
                    <div className="fill" style={{ width: `${percent}%` }}></div>
                </div>
                <p>{current} / {total} XP to next rank</p>
            </div>
        </div>
    );
};

export default Rank;
