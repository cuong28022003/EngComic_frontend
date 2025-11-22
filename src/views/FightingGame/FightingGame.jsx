import React, { useEffect } from 'react';
import './styles.scss';
import { startGame } from './index.js';

const FightingGame = () => {
    useEffect(() => {
        // Thay đổi các ID này theo nhân vật bạn muốn sử dụng
        const playerCharacterId = '69106a90a60d2724f6b04de4'; // Hero Knight
        const enemyCharacterId = '691e8fc1dc2c081e8c549348'; // ID của enemy

        startGame(playerCharacterId, enemyCharacterId);
    }, []);

    return (
        <div className="fighting-container">
            <div className="hud">
                <div className="health-bar player">
                    <div className="bar red"></div>
                    <div id="playerHealth" className="bar blue"></div>
                </div>
                <div id="timer" className="timer">60</div>
                <div className="health-bar enemy">
                    <div className="bar red"></div>
                    <div id="enemyHealth" className="bar blue"></div>
                </div>
            </div>
            <div id="countdownText" className="countdown-text"></div>
            <div id="displayText" className="display-text">Tie</div>
            <canvas></canvas>
        </div>
    );
};

export default FightingGame;
