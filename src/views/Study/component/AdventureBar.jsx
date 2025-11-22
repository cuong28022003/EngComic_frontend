import React, { useEffect, useRef, useState } from "react";
import SpriteAnimator from "../../../components/GachaCard/SpriteAnimator.jsx";

/**
 * AdventureBar
 * Props:
 * - characters: [{spriteSheet, spriteAnimations, frameWidth, frameHeight, action}]
 * - enemies: [{spriteSheet, spriteAnimations, frameWidth, frameHeight, action}]
 * - currentIndex: vị trí hiện tại (số câu đã trả lời)
 * - total: tổng số câu hỏi
 * - enemyPositions: mảng các vị trí xuất hiện địch
 */

const AdventureBar = ({
    characters = [],
    enemies = [],
    currentIndex = 0,
    total = 10,
    enemyPositions = [],
    enemyActions = [], // mảng action cho từng enemy (theo vị trí enemyPositions)
}) => {
    // Tính toán vị trí các mốc trên bar
    const barWidth = 600;
    const barHeight = 100;
    const enemySpacing = barWidth / (total + 1);

    // Hiệu ứng di chuyển mượt cho nhân vật
    const [animatedIndex, setAnimatedIndex] = useState(0);
    const [moveAnim, setMoveAnim] = useState(false);
    const animationRef = useRef();
    console.log("currentIndex: ", currentIndex);

    // Reset về vị trí đầu khi bắt đầu phiên học mới
    useEffect(() => {
        if (currentIndex === 0 && animatedIndex !== 0) {
            setAnimatedIndex(0);
            setMoveAnim(false);
            return;
        }
        if (animatedIndex === currentIndex) {
            setMoveAnim(false);
            return;
        }
        setMoveAnim(true);
        const step = animatedIndex < currentIndex ? 0.05 : -0.05;
        const animate = () => {
            setAnimatedIndex(prev => {
                const next = prev + step;
                if ((step > 0 && next >= currentIndex) || (step < 0 && next <= currentIndex)) {
                    cancelAnimationFrame(animationRef.current);
                    setMoveAnim(false);
                    return currentIndex;
                }
                animationRef.current = requestAnimationFrame(animate);
                return next;
            });
        };
        animationRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRef.current);
        // eslint-disable-next-line
    }, [currentIndex]);

    console.log("enemies in AdventureBar: ", enemies);

    return (
        <div className="adventure-bar" style={{ position: "relative", width: barWidth, height: barHeight, margin: "24px auto" }}>
            {/* Đường đi */}
            <div style={{ position: "absolute", top: barHeight / 2 - 8, left: 0, width: barWidth, height: 16, background: "#eee", borderRadius: 8 }} />
            {/* Kẻ địch chỉ xuất hiện ở các mốc enemyPositions */}
            {enemyPositions.map((pos, idx) => {
                const enemy = enemies[idx % enemies.length];
                const action = enemyActions[pos] || "idle";
                if (action === "hidden") return null;
                return (
                    <div
                        key={pos}
                        style={{ position: "absolute", left: enemySpacing * (pos + 1) - 32, top: barHeight / 2 - 48 }}
                    >
                        <SpriteAnimator
                            spriteSheet={enemy.spriteSheetUrl}
                            animations={enemy.animations}
                            action={action}
                            frameWidth={enemy.frameWidth || 64}
                            frameHeight={enemy.frameHeight || 64}
                            fps={10}
                            loop={action !== "attack"} // chỉ attack 1 lần
                        />
                    </div>
                );
            })}

            {/* Nhân vật di chuyển mượt đến vị trí mới */}
            {characters.map((char, idx) => (
                <div
                    key={idx}
                    style={{ position: "absolute", left: enemySpacing * animatedIndex - 32 + idx * 48, top: barHeight / 2 + 16, transition: 'left 0.2s linear' }}
                >
                    <SpriteAnimator
                        spriteSheet={char.spriteSheetUrl}
                        animations={char.animations}
                        action={moveAnim ? "move" : (char.action || "idle")}
                        frameWidth={char.frameWidth || 64}
                        frameHeight={char.frameHeight || 64}
                        fps={10}
                    />
                </div>
            ))}
        </div>
    );
};

export default AdventureBar;
