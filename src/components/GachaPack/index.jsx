import './styles.scss';
import GachaCard from '../GachaCard';

const GachaPack = ({ pack, character, opened, onOpen }) => {
    return (
        <div className={`pack-container ${opened ? 'opened' : ''}`} onClick={onOpen}>
            {!opened ? (
                <img
                    src={pack?.imageUrl}
                    className={`pack-img rarity-${character?.rarity} ${character?.rarity === 'SSR' ? 'glow' : ''}`}
                    alt="pack"
                />
            ) : (
                <GachaCard pack={pack} character={character} />
            )}
        </div>
    );
};

export default GachaPack;
