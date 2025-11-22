import './styles.scss';
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import Modal from '../Modal/index.jsx';
import SpriteCanvas from '../SpriteCanvas/index.jsx';

const GachaCard = ({ character, mode = "default", selected = false, onSelect, disabled = false, size }) => {
    const [isOpen, setIsOpen] = useState(false);
    // console.log("mode: ", mode);
    // console.log("character in GachaCard: ", character);

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

    // Lấy sprite idle từ character
    const idleSprite = character?.sprites?.idle;
    const spriteScale = character?.scale || 1;
    const spriteOffset = character?.offset || { x: 0, y: 0 };
    const width = 300;
    const height = 200;
    const spriteWidth = character?.width || 200;
    const spriteHeight = character?.height || 200;
    const spritePosition = { x: (width - spriteWidth) / 2, y: (height - spriteHeight) / 2 };

    return (
        <>
            <div
                className={`gacha-card rarity-${character.rarity} 
                ${selected ? 'selected' : ''} 
                ${disabled ? 'disabled' : ''}
                ${size === 'small' ? 'small' : ''}`}
                onClick={handleCardClick}
            >
                {/* Chỉ hiển thị ảnh tĩnh ở card ngoài */}
                <img src={character.imageUrl} alt={character.name} />
                <div className="name">{character.name}</div>
            </div>

            {mode === "default" && isOpen && (
                <Modal>
                    <div className="card-overlay" onClick={handleClose}>
                        <div className="card-detail">
                            <div className="card-left">
                                <div className="card-image">
                                    {/* Ảnh tĩnh phía trên */}
                                    <img src={character.imageUrl} alt={character.name} />
                                </div>
                                <p className="description">{character.description}</p>
                                <div className="pack-info">
                                    <img src={character?.pack.imageUrl} alt={character?.pack.name} />
                                    <span>{character?.pack.name}</span>
                                </div>
                            </div>
                            <div className="card-info">
                                <div className="character-header">
                                    <h2>{character.name}</h2>
                                    <div className={`rarity-tag rarity-${character.rarity}`}>
                                        {character.rarity}
                                    </div>
                                </div>
                                {idleSprite && idleSprite.imageSrc && (
                                    <div className="sprite-container">
                                        <SpriteCanvas
                                            imageSrc={idleSprite.imageSrc}
                                            width={width}
                                            height={height}
                                            scale={spriteScale}
                                            framesMax={idleSprite.framesMax}
                                            framesHold={8}
                                            position={spritePosition}
                                            offset={spriteOffset}
                                            facing={1}
                                            animate={true}
                                            loop={true}
                                        />
                                    </div>
                                )}
                                {/* Stats Info */}
                                {character.stats && (
                                    <div className="stats-info">
                                        <h4>Chỉ số:</h4>
                                        <div className="stats-grid">
                                            <div className="stat-item">
                                                <span className="stat-label">❤️ Máu:</span>
                                                <span className="stat-value">{character.stats.health}</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">⚔️ Tấn công:</span>
                                                <span className="stat-value">{character.stats.attack}</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">🛡️ Phòng thủ:</span>
                                                <span className="stat-value">{character.stats.defense}</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">⚡ Tốc độ:</span>
                                                <span className="stat-value">{character.stats.speed}</span>
                                            </div>
                                            {/* {character.stats.gravity && (
                                                <div className="stat-item">
                                                    <span className="stat-label">🌍 Trọng lực:</span>
                                                    <span className="stat-value">{character.stats.gravity}</span>
                                                </div>
                                            )} */}
                                        </div>
                                    </div>
                                )}
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
