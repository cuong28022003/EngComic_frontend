import './styles.scss';
import GachaCard from '../GachaCard';

const GachaPack = ({ data, style, opened, onOpen }) => {
    return (
        <div className={`pack-container ${opened ? 'opened' : ''}`} onClick={onOpen}>
            {!opened ? (
                <img
                    src={data.coverImageUrl}
                    className={`pack-img rarity-${data.cardInside.rarity} ${data.cardInside.rarity === 'SSR' ? 'glow' : ''}`}
                    style={style}
                    alt="pack"
                />
            ) : (
                <GachaCard card={data.cardInside} />
            )}
        </div>
    );
};

export default GachaPack;
