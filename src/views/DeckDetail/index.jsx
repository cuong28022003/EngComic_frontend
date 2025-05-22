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
import { setSelectedCharacters, setActiveSkills } from '../../redux/slice/character';
import { checkCanUseSkill } from '../../api/characterUsageApi';

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
        const createActiveSkills = async () => {

            // Lấy ngày hôm nay theo định dạng yyyy-MM-dd
            const today = new Date().toISOString().slice(0, 10);

            // Đảm bảo mỗi skill chỉ được kích hoạt 1 lần
            let activeSkills = [];

            for (const char of companions) {
                if (!char) continue; // Bỏ qua nếu char là null hoặc undefined

                if (char.skillsUsagePerDay &&
                    char.skillsUsagePerDay["DOUBLE_XP"] &&
                    !activeSkills.some(s => s.skill === "DOUBLE_XP")) {
                    const payload = {
                        userId: user.id,
                        characterId: char.id,
                        skill: "DOUBLE_XP",
                        date: today,
                    }
                    const canUse = await checkCanUseSkill(payload, user, dispatch, loginSuccess); // true or false
                    if (canUse) {
                        activeSkills.push({ skill: "DOUBLE_XP", character: char });
                    }
                }

                if (char.skillsUsagePerDay &&
                    char.skillsUsagePerDay["BONUS_DIAMOND"] &&
                    char.rarity === "SSR" &&
                    !activeSkills.some(s => s.skill === "BONUS_DIAMOND")) {
                    const payload = {
                        userId: user.id,
                        characterId: char.id,
                        skill: "BONUS_DIAMOND",
                        date: today,
                    }
                    const canUse = await checkCanUseSkill(payload, user, dispatch, loginSuccess); // true or false
                    if (canUse) {
                        activeSkills.push({ skill: "BONUS_DIAMOND", character: char });
                    }
                }

                if (
                    char.skillsUsagePerDay &&
                    char.skillsUsagePerDay["SHOW_ANSWER"] &&
                    !activeSkills.some(s => s.skill === "SHOW_ANSWER")
                ) {
                    const payload = {
                        userId: user.id,
                        characterId: char.id,
                        skill: "SHOW_ANSWER",
                        date: today,
                    };
                    const canUse = await checkCanUseSkill(payload, user, dispatch, loginSuccess);
                    if (canUse) {
                        activeSkills.push({ skill: "SHOW_ANSWER", character: char });
                    }
                }
            }
            dispatch(setActiveSkills(activeSkills));
            console.log("Active Skills:", activeSkills);
        };
        createActiveSkills();
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
