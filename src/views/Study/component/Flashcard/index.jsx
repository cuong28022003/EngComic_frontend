import "./styles.scss";

const Flashcard = ({ front, back, ipa, isFlipped }) => {
    return (
        <div className={`flashcard ${isFlipped ? "flipped" : ""}`}>
            <div className="card-inner">
                <div className="card-front">{front}</div>
                <div className="card-back">{back}
                    {ipa && (
                        <div className="card-ipa">
                            /{ipa}/
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Flashcard;
