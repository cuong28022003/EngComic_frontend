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
import GachaCard from "../../components/GachaCard";

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
    const selectedCharacters = useSelector((state) => state.character.selectedCharacters);
    // console.log("Selected Characters:", selectedCharacters);
    const activeSkills = useSelector((state) => state.character.activeSkills);
    const canFlip = activeSkills.some(s => s.skill === "SHOW_ANSWER")
    const dispatch = useDispatch
    const navigate = useNavigate();
    const inputRef = useRef(null); // Reference to the input element

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

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!showReview) return;
            switch (e.key.toLowerCase()) {
                case 'a': // Again
                    handleReview("AGAIN");
                    break;
                case 'h': // Hard
                    handleReview("HARD");
                    break;
                case 'g': // Good
                    handleReview("GOOD");
                    break;
                case 'e': // Easy
                    handleReview("EASY");
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showReview, currentIndex]);

    useEffect(() => {
        if (!loading && inputRef.current) {
            inputRef.current.focus();
        }
    }, [loading, currentIndex]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="study-container">
            <div className="character-cards">
                {selectedCharacters.map((char, index) => (
                    <GachaCard key={index} character={char} size="small" />
                ))}
            </div>

            <ProgressBar current={currentIndex + 1} total={cards.length} />

            <div className="flashcard-wrapper"
                onClick={() => (canFlip ? handleFlip() : (showAnswer && handleFlip()))}
                style={{ cursor: canFlip || showAnswer ? "pointer" : "default" }}>
                <Flashcard front={cards[currentIndex]?.front} back={cards[currentIndex]?.back} isFlipped={showAnswer} />
            </div>

            {!showReview && (
                <form className="answer-form" onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
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
                    <ReviewButton text="Again (A)" color="red" handleNextCard={() => handleReview("AGAIN")} />
                    <ReviewButton text="Hard (H)" color="orange" handleNextCard={() => handleReview("HARD")} />
                    <ReviewButton text="Good (G)" color="green" handleNextCard={() => handleReview("GOOD")} />
                    <ReviewButton text="Easy (E)" color="blue" handleNextCard={() =>handleReview("EASY")} />
                </div>
            )}
        </div>
    );
};

export default StudyPage;