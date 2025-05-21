import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.scss';
import { getDeckById } from '../../api/deckApi';
import { deleteCardById, getCardsByDeckId } from '../../api/cardApi';
import { loginSuccess } from '../../redux/slice/auth';
import { useSelector, useDispatch } from 'react-redux';
import { routeLink } from '../../routes/AppRoutes';
import ConfirmDialog from '../../components/ConfirmDialog';
import CompanionSelector from './component/CompanionSelector';
import { setSelectedCharacters } from '../../redux/slice/characterSelection';

const DeckDetailPage = () => {
    const { deckId } = useParams();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.login?.user);
    const dispatch = useDispatch();

    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [companions, setCompanions] = useState([null, null, null]);

    useEffect(() => {
        dispatch(setSelectedCharacters(companions));
    }, [companions])

    useEffect(() => {
        getDeckById(deckId, user, dispatch, loginSuccess)
            .then(res => setDeck(res.data))
            .catch(err => console.error(err));

        getCardsByDeckId(deckId, user, dispatch, loginSuccess)
            .then(res => setCards(res.data.content))
            .catch(err => console.error(err));
    }, [deckId]);

    const handleDeleteCard = async (cardId) => {
        setSelectedCardId(cardId);
        setConfirmOpen(true);

    };

    const confirmDelete = () => {
        if (!selectedCardId) return;

        try {
            deleteCardById(selectedCardId, user, dispatch, loginSuccess);
            setCards(prev => prev.filter(card => card.id !== selectedCardId));
            setConfirmOpen(false);
            setSelectedCardId(null);
        } catch (err) {
            console.error(err);
        }
    };

    if (!deck) return <p>Loading...</p>;

    return (
        <div className={"deck-detail-container"}>
            <h1>{deck.name}</h1>
            <p className={"description"}>{deck.description}</p>
            {deck.stats && (
                <div className="statistics">
                    <span>🆕 Thẻ mới: {deck.stats.totalNew}</span>
                    <span>🟢 Dễ: {deck.stats.totalEasy}</span>
                    <span>🔴 Khó: {deck.stats.totalHard}</span>
                    <span>📚 Cần học: {deck.stats.totalDue}</span>
                </div>
            )}

            <div className={"actions"}>
                <button onClick={() => navigate(routeLink.createCard.replace(':deckId', deckId))}>
                    ➕ Thêm Card
                </button>
                <button onClick={() => navigate(routeLink.study.replace(':deckId', deckId))}>
                    🚀 Bắt đầu học
                </button>
            </div>

            <h2>Đồng hành</h2>
            <CompanionSelector
                selectedCharacters={companions}
                onChange={setCompanions}
            />


            <div className={"cardList"}>
                {cards.map(card => (
                    <div key={card.id} className={"cardItem"}>
                        <div className={"frontBack"}>
                            <div><strong>Front:</strong> {card.front}</div>
                            <div><strong>Back:</strong> {card.back}</div>
                        </div>
                        <div className={"cardActions"}>
                            <button onClick={() => navigate(routeLink.editCard.replace(':deckId', deckId).replace(':cardId', card.id))}>✏️</button>
                            <button onClick={() => handleDeleteCard(card.id)}>🗑️</button>
                        </div>
                    </div>
                ))}
            </div>

            {confirmOpen && (
                <ConfirmDialog
                    message="Bạn có chắc muốn xoá Card này không?"
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
};

export default DeckDetailPage;
