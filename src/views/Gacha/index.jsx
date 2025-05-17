import React, { useState } from "react";
import "./styles.scss";
import { rollGacha } from "../../api/gachaApi";
import GachaPack from "../../components/GachaPack";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/auth";
import { updateUserStats } from "../../redux/slice/userStats";

const GachaPage = () => {
    const user = useSelector((state) => state.auth.login?.user);
    const userStats = useSelector((state) => state.userStats.data);
    const dispatch = useDispatch();
    console.log("userStats", userStats);

    const [packs, setPacks] = useState([]);
    const [opened, setOpened] = useState({});
    const [autoOpening, setAutoOpening] = useState(false);

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
        setOpened({});
        setPacks([]); // Reset packs tạm thời để đảm bảo hiệu ứng được làm mới
        setTimeout(() => {
            setPacks(data); // Cập nhật packs mới sau khi reset
        }, 0);
    };

    const openPack = (index) => {
        if (opened[index]) return;
        setOpened((prev) => ({ ...prev, [index]: true }));
    };

    const openAll = () => {
        setAutoOpening(true);
        packs.forEach((_, i) =>
            setTimeout(() => openPack(i), i * 500)
        );
        setTimeout(() => setAutoOpening(false), packs.length * 500);
    };

    const allOpened = Object.keys(opened).length === packs.length;

    return (
        <div className="gacha-page">
            <div className="controls">
                {!packs.length || allOpened ? (
                    <>
                        <button onClick={() => summon(1)}>Mở 1 ({GACHA_COST}💎)</button>
                        <button onClick={() => summon(10)}>Mở 10 ({GACHA_COST * 10}💎)</button>
                    </>
                ) : (
                    !autoOpening &&
                    packs.length > 0 &&
                    !allOpened && (
                        <button onClick={openAll}>Mở tất cả</button>
                    )
                )}
            </div>
            <div className="pack-grid">
                {packs.map((pack, index) => (
                    <GachaPack
                        key={index}
                        pack={pack.pack}
                        character={pack.character}
                        opened={opened[index]}
                        onOpen={() => openPack(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default GachaPage;