import './styles.scss';
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import Modal from '../Modal/index.jsx';

const GachaCard = ({ character, mode = "default", selected = false, onSelect, disabled = false, size}) => {
    const [isOpen, setIsOpen] = useState(false);
    // console.log("mode: ", mode);

    const skillNameMap = {
        SHOW_ANSWER: "LẬT ĐÁP ÁN",
        DOUBLE_XP: "NHÂN ĐÔI XP",
    // Thêm các kỹ năng khác nếu có
    };

    // useEffect(() => {
    //     if (character && character?.rarity === 'SSR') {
    //         confetti();
    //     }
    // }, [character]);

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
                {/* {character.rarity === 'SSR' ? (
                    <video src={character.imageUrl} autoPlay loop muted onEnded={handleVideoEnd} />
                ) : (
                )} */}
                <img src={character.imageUrl} alt={character.name} />
                <div className="name">{character.name}</div>
            </div>

            {mode === "default" && isOpen && (
                <Modal>
                    <div className="card-overlay" onClick={handleClose}>
                        <div className="card-detail">
                            <div className="card-image">
                                {/* {character.rarity === 'SSR' ? (
                                    <video src={character.imageUrl} autoPlay loop muted onEnded={handleVideoEnd} />
                                ) : (
                                )} */}
                                <img src={character.imageUrl} alt={character.name} />
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
                                {/* Bonus Info */}
                                {(character.bonusXp > 0 || character.bonusDiamond > 0) && (
                                    <div className="bonus-info">
                                        {character.bonusXp > 0 && (
                                            <div className="bonus-xp">+{character.bonusXp} XP</div>
                                        )}
                                        {character.bonusDiamond > 0 && (
                                            <div className="bonus-diamond">+{character.bonusDiamond} 💎</div>
                                        )}
                                    </div>
                                )}
                                {/* Skills Info */}
                                {character.skillsUsagePerDay && Object.keys(character.skillsUsagePerDay).length > 0 && (
                                    <div className="skills-info">
                                        <h4>Kỹ năng:</h4>
                                        <ul>
                                            {Object.entries(character.skillsUsagePerDay).map(([skill, maxUsage]) => (
                                                <li key={skill}>
                                                    <span className="skill-name">{skillNameMap[skill] || skill}</span>
                                                    <span className="skill-usage">
                                                        {character.usedSkills?.[skill] || 0}/{maxUsage} lần/ngày
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </Modal>
            )}
        </>
    );
};

export default GachaCard;
