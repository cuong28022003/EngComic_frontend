import { useEffect, useState } from 'react';
import { getUserStats } from '../../../api/userStatsApi';
import { getAllRanks } from '../../../api/rankApi';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../../redux/slice/auth';
import { useParams } from 'react-router-dom';
import GachaCard from '../../../components/GachaCard';
import { useOutletContext } from 'react-router-dom';

const Rank = () => {
    const { isReadOnly } = useOutletContext();
    const { viewedUserStats } = useOutletContext();
    const { userId } = useParams();
    const user = useSelector(state => state.auth.login?.user);
    const dispatch = useDispatch();

    const reduxUserStats = useSelector(state => state.userStats.data);
    const stats = isReadOnly ? viewedUserStats : reduxUserStats;
    const [ranks, setRanks] = useState([]);
    const [selectedRank, setSelectedRank] = useState(null);
    const xp = stats?.xp || 0;
    let percent = 0;
    let progressText = '';

    if (xp > selectedRank?.maxXp) {
        percent = 100;
        progressText = '✅ Đã đạt';
    } else if (xp < selectedRank?.minXp) {
        percent = 0;
        progressText = '❌ Chưa đạt';
    } else {
        const current = xp - selectedRank?.minXp;
        const total = selectedRank?.maxXp - selectedRank?.minXp;
        percent = Math.floor((current / total) * 100);
        progressText = `${current} / ${total} XP to next rank`;
    }

    useEffect(() => {
        const fetchRanks = async () => {
            try {
                const response = await getAllRanks();
                const data = response.data;
                setRanks(data);
            } catch (error) {
                console.error("Error fetching ranks:", error);
            }
        }
        fetchRanks();
    }, [user]);

    // Khi đã có stats và ranks, tự động chọn rank phù hợp với xp
    useEffect(() => {
        if (!stats || !ranks.length) return;
        const xp = stats.xp || 0;
        // Tìm rank phù hợp với xp
        const foundRank = ranks.find(
            r => xp >= r.minXp && xp <= r.maxXp
        );
        if (foundRank) setSelectedRank(foundRank);
    }, [stats, ranks]);

    if (!stats || !ranks.length || !selectedRank) return <p>Loading rank...</p>;

    return (
        <div className="rank-wrapper">
            <div className="rank-detail">
                <img src={selectedRank?.badge} alt="badge" className="badge" />
                <div className="info">
                    <h3>{selectedRank?.name}</h3>
                    <p className="xp-info">
                        XP: {xp} / {selectedRank.minXp}
                    </p>
                    <div className="progress-bar">
                        <div className="fill" style={{ width: `${percent}%` }}></div>
                    </div>
                    <p>{progressText}</p>
                </div>
                <div className="rank-rewards">
                    <p>💎 {selectedRank?.rewardDiamond}</p>
                    <div>
                        <GachaCard
                            character={selectedRank?.rewardCharacter}
                        />
                    </div>
                </div>
            </div>
            <div className="rank-list">
                {ranks.map(r => (
                    <div
                        key={r.id}
                        className={`rank-item ${selectedRank?.id === r.id ? 'active' : ''}`}
                        onClick={() => setSelectedRank(r)}
                    >
                        <img src={r.badge} alt="badge" className="rank-item-badge" />
                        <span>{r.name}</span>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default Rank;
