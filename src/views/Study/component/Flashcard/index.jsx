import "./styles.scss";

const Flashcard = ({ front, back, isFlipped }) => {
    return (
        <div className={`flashcard ${isFlipped ? "flipped" : ""}`}>
            <div className="card-inner">
                <div className="card-front">{front}</div>
                <div className="card-back">{back}</div>
            </div>
        </div>
    );
};

export default Flashcard;
