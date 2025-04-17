import "./styles.scss";

const ReviewButton = ({ text, color, handleNextCard }) => {
    return (
        <button className={`review-button ${color}`} onClick={handleNextCard}>
            {text}
        </button>
    );
};

export default ReviewButton;