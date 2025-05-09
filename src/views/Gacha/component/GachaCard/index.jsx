import './styles.scss';
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

const GachaCard = ({ card }) => {
    useEffect(() => {
        if (card.rarity === 'SSR') {
            // const audio = new Audio("/sounds/ssr.mp3");
            // audio.play();
            confetti(); // gọi thư viện confetti nếu dùng (ex: canvas-confetti)
        }
    }, []);

    return (
        <div className={`gacha-card rarity-${card.rarity}`}>
            <img src={card.imageUrl} alt={card.name} />
            <div className="name">{card.name}</div>
        </div>
    );
};

export default GachaCard;
