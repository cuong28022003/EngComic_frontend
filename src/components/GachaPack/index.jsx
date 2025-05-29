import './styles.scss';
import GachaCard from '../GachaCard';

const GachaPack = ({ pack, character, opened, onOpen }) => {
    const isOwned = opened?.owned;
    console.log("GachaPack opened:", opened);
    const diamondReward = opened?.diamondReward;
    console.log("GachaPack diamondReward:", diamondReward);

    return (
        <div
            className={`pack-container ${opened ? 'opened' : ''} ${isOwned ? "owned" : ""}`}
            onClick={onOpen}
        >
            <div className="pack-content">
                {!opened?.opened ? (
                    <img
                        src={pack?.imageUrl}
                        className={`pack-img rarity-${character?.rarity} ${character?.rarity === 'SSR' ? 'glow' : ''}`}
                        alt="pack"
                    />
                ) : (
                    <GachaCard character={character} />
                )}
            </div>
            {isOwned && (
                <div className="diamond-reward">
                    +{diamondReward} 💎
                </div>
            )}
        </div>
    );
};

export default GachaPack;
