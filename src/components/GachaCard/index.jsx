import './styles.scss';
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import Modal from '../Modal/index.jsx';

const GachaCard = ({ character, mode = "default", selected = false, onSelect, disabled = false, size}) => {
    const [isOpen, setIsOpen] = useState(false);
    console.log("mode: ", mode);

    useEffect(() => {
        if (character && character?.rarity === 'SSR') {
            confetti();
        }
    }, [character]);

    if (!character) {
        return null;
    }

    const handleCardClick = () => {
        if (mode === 'selection') {
            if (!disabled && onSelect) {
                onSelect(character);
            }
        } else {
            setIsOpen(true);
        }
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
            <div className={`gacha-card rarity-${character.rarity} 
                ${selected ? 'selected' : ''} 
                ${disabled ? 'disabled' : ''}
                ${size === 'small' ? 'small' : ''}`}
                onClick={handleCardClick}>
                {character.rarity === 'SSR' ? (
                    <video src={character.imageUrl} autoPlay loop muted onEnded={handleVideoEnd} />
                ) : (
                    <img src={character.imageUrl} alt={character.name} />
                )}
                <div className="name">{character.name}</div>
            </div>

            {mode === "default" && isOpen && (
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
                                    <img src={character?.pack.imageUrl} alt={character?.pack.name} />
                                    <span>{character?.pack.name}</span>
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
