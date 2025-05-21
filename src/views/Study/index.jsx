import Flashcard from "./component/Flashcard";
import ReviewButton from "./component/ReviewButton";
import ProgressBar from "./component/ProgressBar";
import "./styles.scss";
import { useState, useEffect, useRef } from "react";
import { getCardsByDeckId, reviewCard } from "../../api/cardApi";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/slice/auth";
import { useNavigate, useParams } from "react-router-dom";
import { routeLink } from "../../routes/AppRoutes";
import { v4 as uuidv4 } from 'uuid';

const StudyPage = () => {
    const [sessionId] = useState(uuidv4());
    const [showAnswer, setShowAnswer] = useState(false);
    const [answer, setAnswer] = useState("");
    const [showReview, setShowReview] = useState(false);
    const [highlightedAnswer, setHighlightedAnswer] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [correct, setCorrect] = useState(false);
    const [reviewResults, setReviewResults] = useState([]);
    const reviewResultsRef = useRef([]);
    const { deckId } = useParams()
    const user = useSelector((state) => state.auth.login?.user);
    const dispatch = useDispatch
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await getCardsByDeckId(deckId, user, dispatch, loginSuccess);
                // console.log("Cards:", response); 
                setCards(response?.data?.content || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching cards:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCards();
    }, []);

    const handleInput = (e) => {
        setAnswer(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowAnswer(true);
        setShowReview(true);
        const correctAnswer = cards[currentIndex].back;
        speak(correctAnswer); // Text To Speech

        setCorrect(answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase());

        const result = highlightWrongWords(answer, correctAnswer);
        setHighlightedAnswer(result);
    };

    const handleFlip = () => {
        setShowAnswer(!showAnswer);
    };

    const speak = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        window.speechSynthesis.speak(speech);
    };

    const highlightWrongWords = (userAnswer, correctAnswer) => {
        const userWords = userAnswer.trim().split(" ");
        const correctWords = correctAnswer.trim().split(" ");

        return correctWords.map((word, index) => {
            if (userWords[index] && userWords[index].toLowerCase() === word.toLowerCase()) {
                return `<span>${word}</span>`;
            }
            return `<span style="color: red;">${userWords[index] || "___"}</span>`;
        }).join(" ");
    };

    const handleReview = (reviewState) => {
        setAnswer("");
        setShowAnswer(false);
        setShowReview(false);
        setHighlightedAnswer("");

        console.log("isCorrect:", correct);
        console.log("reviewState:", reviewState);
        console.log("currentIndex:", currentIndex);
        
        const resultData = {
            ...cards[currentIndex],
            reviewState,
            userAnswer: answer,
            correct: correct,
        };

        reviewResultsRef.current.push(resultData);

        // // Lưu kết quả vào state
        // setReviewResults(prev => [
        //     ...prev,
        //     {
        //         ...cards[currentIndex],
        //         reviewState,
        //         userAnswer: answer
        //     }
        // ]);

        console.log("Review Results:", reviewResultsRef.current); // Debugging line

        const data = {
            cardId: cards[currentIndex].id,
            correct: correct,
            reviewState: reviewState,
            userAnswer: answer,
        };

        try {
            const response = reviewCard(data, user, dispatch, loginSuccess);
        } catch (error) {
            console.error("Error reviewing card:", error);
        }

        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigate(routeLink.result.replace(':deckId', deckId), {
                state: {
                    reviewResults: reviewResultsRef.current,
                    sessionId: sessionId,
                }
            });
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="study-container">
            <ProgressBar current={currentIndex + 1} total={cards.length} />

            <div className="flashcard-wrapper" onClick={handleFlip}>
                <Flashcard front={cards[currentIndex]?.front} back={cards[currentIndex]?.back} isFlipped={showAnswer} />
            </div>

            {!showReview && (
                <form className="answer-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nhập đáp án..."
                        value={answer}
                        onChange={handleInput}
                    />
                </form>
            )}
            
            {showReview && (
                <div className="user-answer">
                    <p>Your Answer:</p>
                    <div dangerouslySetInnerHTML={{ __html: highlightedAnswer }} />
                </div>
            )}

            {showReview && (
                <div className="button-group">
                    <ReviewButton text="Again" color="red" handleNextCard={() => handleReview("AGAIN")} />
                    <ReviewButton text="Hard" color="orange" handleNextCard={() => handleReview("HARD")} />
                    <ReviewButton text="Good" color="green" handleNextCard={() => handleReview("GOOD")} />
                    <ReviewButton text="Easy" color="blue" handleNextCard={() =>handleReview("EASY")} />
                </div>
            )}
        </div>
    );
};

export default StudyPage;