import './styles.scss';

const DeckCard = ({ deck, onClick, onEdit, onDelete }) => {
    return (
        <div className={"card"}>
            <div className={"content"} onClick={() => onClick(deck.id)}>
                <h3>{deck.name}</h3>
                <p>{deck.description}</p>
            </div>
            {deck.stats && (
                <div className="statistics">
                    <span>🆕 {deck.stats.totalNew}</span>
                    <span>🟢 {deck.stats.totalEasy}</span>
                    <span>🔴 {deck.stats.totalHard}</span>
                    <span>📚 {deck.stats.totalDue}</span>
                </div>
            )}
            <div className={"actions"}>
                <button onClick={() => onEdit(deck)} className={"edit"}>📝</button>
                <button onClick={() => onDelete(deck.id)} className={"delete"}>🗑️</button>
            </div>
        </div>
    );
};

export default DeckCard;
