import React, { useState } from "react";
import "./styles.scss";
import { rollGacha } from "../../api/gachaApi";
import GachaPack from "../../components/GachaPack";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/auth";
import { updateUserStats } from "../../redux/slice/userStats";
import { getAllCharactersByUserId } from "../../api/characterApi";
import { useEffect } from "react";

const GachaPage = () => {
    const user = useSelector((state) => state.auth.login?.user);
    const userStats = useSelector((state) => state.userStats.data);
    const dispatch = useDispatch();
    console.log("userStats", userStats);

    const [ownedCharacters, setOwnedCharacters] = useState([]);
    console.log("ownedCharacters", ownedCharacters);
    const [packs, setPacks] = useState([]);
    const [stats, SetStats] = useState({}); // 
    const [autoOpening, setAutoOpening] = useState(false);

    const rarityToDiamond = {
        C: 10,
        R: 20,
        SR: 50,
        SSR: 100,
    };

    function getDiamondByRarity(rarity) {
        return rarityToDiamond[rarity];
    }

    const GACHA_COST = 100; // Số kim cương cho roll 1
    
    const summon = async (count) => {
        const totalCost = count * GACHA_COST;
        if (userStats?.diamond < totalCost) {
            alert("Bạn không đủ kim cương!");
            return;
        }
        const res = await rollGacha(count, user, dispatch, loginSuccess);
        const data = await res.data;
    
        dispatch(updateUserStats({ ...userStats, diamond: userStats.diamond - totalCost }));

        // Reset trạng thái opened để kích hoạt lại hiệu ứng
        SetStats({});
        setPacks([]); // Reset packs tạm thời để đảm bảo hiệu ứng được làm mới
        setTimeout(() => {
            setPacks(data); // Cập nhật packs mới sau khi reset
        }, 0);
    };

    const openPack = (index) => {
        if (stats[index]) return;

        const character = packs[index];
        console.log("character", character);
        const owned = ownedCharacters.some(
            (char) => char.id === character.id
        );

        if (owned) {
            // Quy đổi kim cương
            const diamondReward = getDiamondByRarity(packs[index]?.rarity);
            dispatch(updateUserStats({
                ...userStats,
                diamond: userStats.diamond + diamondReward
            }));
            // console.log(`Đã nhận ${diamondReward} kim cương từ pack ${index}`);
            // Đánh dấu pack đã sở hữu và số kim cương quy đổi
            SetStats((prev) => ({
                ...prev,
                [index]: {opened: true, owned: true, diamondReward: diamondReward }
            }));
        } else {
            SetStats((prev) => ({
                ...prev,
                [index]: {opened: true, owned: false }
            }));
            setOwnedCharacters((prev) => [...prev, character]);
        }

    };

    const openAll = () => {
        setAutoOpening(true);
        packs.forEach((_, i) =>
            setTimeout(() => openPack(i), i * 500)
        );
        setTimeout(() => setAutoOpening(false), packs.length * 500);
    };

    const allOpened = Object.keys(stats).length === packs.length;

    useEffect(() => {
        const fetchOwnedCharacters = async () => {
            try {
                const response = await getAllCharactersByUserId(user?.id, user, dispatch, loginSuccess);
                const data = response.data || [];
                setOwnedCharacters(data);
            } catch (error) {
                console.error("Error fetching owned characters:", error);
            }
        }
        fetchOwnedCharacters();
    }, [])

    return (
        <div className="gacha-page">
                <div className="controls">
                {!packs.length || allOpened ? (
                    <>
                        <button className="button-primary" onClick={() => summon(1)}>Mở 1 ({GACHA_COST}💎)</button>
                        <button className="button-primary" onClick={() => summon(10)}>Mở 10 ({GACHA_COST * 10}💎)</button>
                    </>
                ) : (
                    !autoOpening &&
                    packs.length > 0 &&
                    !allOpened && (
                        <button className="button-accent" onClick={openAll}>Mở tất cả</button>
                    )
                )}
            </div>
            <div className="pack-grid">
                {packs.map((pack, index) => (
                    <GachaPack
                        key={index}
                        pack={pack.pack}
                        character={pack}
                        opened={stats[index]}
                        onOpen={() => openPack(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default GachaPage;