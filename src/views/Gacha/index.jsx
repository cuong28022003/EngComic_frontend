import React, { useState } from "react";
import "./styles.scss";
import { rollGacha } from "../../api/gachaApi";
import GachaPack from "./component/GachaPack";

const GachaPage = () => {
    const [packs, setPacks] = useState([]);
    const [opened, setOpened] = useState({});
    const [autoOpening, setAutoOpening] = useState(false);

    const summon = async (count) => {
        const res = await rollGacha(count);
        const data = await res.data;

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
                        <button onClick={() => summon(1)}>Mở 1</button>
                        <button onClick={() => summon(10)}>Mở 10</button>
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
                        data={pack}
                        opened={opened[index]}
                        onOpen={() => openPack(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default GachaPage;