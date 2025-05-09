import './styles.scss';
import { useEffect, useState } from 'react';

const StreakPopup = ({ streak, onDone }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible(false);
            onDone?.();
        }, 3000); // hiệu ứng 3s rồi biến mất

        return () => clearTimeout(timeout);
    }, []);

    return visible ? (
        <div className="streak-popup">
            <div className="fire">🔥</div>
            <div className="streak-text">Streak +1</div>
            <div className="streak-count">{streak} 🔥</div>
        </div>
    ) : null;
};

export default StreakPopup;
