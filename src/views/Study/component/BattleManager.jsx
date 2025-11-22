import { useEffect, useState } from "react";
import AdventureBar from "./AdventureBar";

const BattleManager = ({
    correct,
    isEnemy,
    currentIndex,
    total,
    selectedCharacters,
    enemies,
    onEnemyDefeated,
    onCharacterDefeated,
}) => {
    const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
    const [characterActions, setCharacterActions] = useState(
        selectedCharacters.map(() => "idle")
    );
    const [enemyActions, setEnemyActions] = useState({});

    // Lắng nghe khi người học review xong (đúng / sai)
    useEffect(() => {
        if (correct === null) return; // chưa review
        if (isEnemy) {
            if (correct) handleAttackEnemy();
            else handleEnemyAttack();
        } else {
            if (correct) handleMoveForward();
        }
    }, [correct, isEnemy, currentIndex]);

    /** 🔹 Khi trả lời đúng ở mốc không có enemy */
    const handleMoveForward = () => {
        setCharacterActions((prev) =>
            prev.map((_, idx) => (idx === activeCharacterIndex ? "move" : "idle"))
        );

        // Sau khi di chuyển xong → trở lại idle
        setTimeout(() => {
            setCharacterActions((prev) =>
                prev.map(() => "idle")
            );
        }, 800);
    };

    /** 🔹 Khi trả lời đúng ở mốc có enemy (attack) */
    const handleAttackEnemy = () => {
        setCharacterActions((prev) =>
            prev.map((_, idx) => (idx === activeCharacterIndex ? "attack" : "idle"))
        );
        setEnemyActions((prev) => ({ ...prev, [currentIndex]: "stunned" }));

        // Sau khi animation “attack” kết thúc → trở lại idle + enemy biến mất
        setTimeout(() => {
            setCharacterActions((prev) => prev.map(() => "idle"));
            setEnemyActions((prev) => ({ ...prev, [currentIndex]: "hidden" }));
            onEnemyDefeated?.(currentIndex);
        }, 1000); // 1s = thời gian hết sprite attack
    };

    /** 🔹 Khi trả lời sai ở mốc có enemy (enemy phản công) */
    const handleEnemyAttack = () => {
        setEnemyActions((prev) => ({ ...prev, [currentIndex]: "attack" }));

        setTimeout(() => {
            setEnemyActions((prev) => ({ ...prev, [currentIndex]: "idle" }));

            // Nhân vật bị hạ gục → biến mất
            setCharacterActions((prev) =>
                prev.map((_, idx) => (idx === activeCharacterIndex ? "fall" : "idle"))
            );

            // Sau 1 giây → đổi sang nhân vật tiếp theo (nếu còn)
            setTimeout(() => {
                const next = activeCharacterIndex + 1;
                if (next < selectedCharacters.length) {
                    setActiveCharacterIndex(next);
                    setCharacterActions((prev) =>
                        prev.map((_, idx) => (idx === next ? "idle" : "idle"))
                    );
                } else {
                    onCharacterDefeated?.();
                }
            }, 1000);
        }, 800);
    };

    return (
        <AdventureBar
            characters={
                selectedCharacters.length > 0
                    ? [
                        {
                            ...selectedCharacters[activeCharacterIndex],
                            action: characterActions[activeCharacterIndex],
                        },
                    ]
                    : []
            }
            enemies={enemies}
            currentIndex={currentIndex}
            total={total}
            enemyPositions={enemies.map((_, i) => i)} // truyền các vị trí enemy
            enemyActions={enemyActions}
        />
    );
};

export default BattleManager;
