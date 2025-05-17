import './styles.scss';
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import Modal from '../Modal/index.jsx';

const GachaCard = ({ pack, character }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (pack && character && character?.rarity === 'SSR') {
            confetti();
        }
    }, [character]);

    if (!character && !pack) {
        return null; // Hoặc có thể hiển thị một thông báo nào đó
    }

    const handleCardClick = () => {
        setIsOpen(true);
    };

    const handleClose = (e) => {
        if (e.target.classList.contains('card-overlay')) {
            setIsOpen(false);
        }
    };

    const handleVideoEnd = (e) => {
        e.target.currentTime = 0; // Đặt lại thời gian phát về 0
        e.target.play(); // Phát lại video ngay lập tức
    };

    return (
        <>
            <div className={`gacha-card rarity-${character.rarity}`} onClick={handleCardClick}>
                {character.rarity === 'C' ? (
                    <video src={character.imageUrl} autoPlay loop muted onEnded={handleVideoEnd} />
                ) : (
                    <img src={character.imageUrl} alt={character.name} />
                )}
                <div className="name">{character.name}</div>
            </div>

            {isOpen && (
                <Modal>
                    <div className="card-overlay" onClick={handleClose}>
                        <div className="card-detail">
                            <div className="card-image">
                                {character.rarity === 'C' ? (
                                    <video src={character.imageUrl} autoPlay loop muted onEnded={handleVideoEnd} />
                                ) : (
                                    <img src={character.imageUrl} alt={character.name} />
                                )}
                            </div>
                            <div className="card-info">
                                <h2>{character.name}</h2>
                                <p>{character.description}</p>
                                <div className="pack-info">
                                    <img src={pack.imageUrl} alt={pack.name} />
                                    <span>{pack.name}</span>
                                </div>
                                <div className={`rarity-tag rarity-${character.rarity}`}>
                                    {character.rarity}
                                </div>
                            </div>
                        </div>
                    </div>

                </Modal>
            )}
        </>
    );
};

export default GachaCard;
