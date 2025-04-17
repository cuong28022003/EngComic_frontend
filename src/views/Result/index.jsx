import { useLocation, useNavigate } from "react-router-dom";
import "./styles.scss";

const ResultPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const results = state?.reviewResults || [];

    const countByType = (type) =>
        results.filter(r => r.reviewState === type).length;

    // Lọc các thẻ người dùng trả lời sai
    const incorrectCards = results.filter(
        (r) => r.correct === false
    );

    console.log("Incorrect Cards:", incorrectCards); // Debugging line

    return (
        <div className="result-page">
            <h2>🎉 You've finished your session!</h2>
            <p>Total Cards Reviewed: <strong>{results.length}</strong></p>

            <div className="stats">
                <p>🟥 Again: {countByType("AGAIN")}</p>
                <p>🟧 Hard: {countByType("HARD")}</p>
                <p>🟩 Good: {countByType("GOOD")}</p>
                <p>🟦 Easy: {countByType("EASY")}</p>
            </div>

            <div className="card-results">
                {incorrectCards.map((r, idx) => (
                    <div key={idx} className="card-result">
                        <div><strong>Q:</strong> {r.front}</div>
                        <div><strong>Your Answer:</strong> {r.userAnswer}</div>
                        <div><strong>Correct Answer:</strong> {r.back}</div>
                        <div><strong>Review:</strong> {r.reviewState}</div>
                    </div>
                ))}
            </div>

            <button onClick={() => navigate("/")}>🔁 Back to Home</button>
        </div>
    );
};

export default ResultPage;
