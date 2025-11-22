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
import CardFormModal from './component/AddEditCard';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination/index.jsx';
import Loading from '../../components/Loading/index.jsx';

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

    const [addCardOpen, setAddCardOpen] = useState(false);
    const [editCardId, setEditCardId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5; // hoặc giá trị bạn muốn

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

    const loadCards = (page = 1) => {
        const params = {
            page: page - 1,
            size: pageSize,
        }
        getCardsByDeckId(deckId, params, user, dispatch, loginSuccess)
            .then(res => {
                setCards(res.data.content)
                setTotalPages(res.data.totalPages);
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        getDeckById(deckId, user, dispatch, loginSuccess)
            .then(res => setDeck(res.data))
            .catch(err => console.error(err));

        loadCards(currentPage);
    }, [deckId, currentPage]);

    const handleDeleteCard = async (cardId) => {
        setSelectedCardId(cardId);
        setConfirmOpen(true);

    };

    const confirmDelete = () => {
        if (!selectedCardId) return;

        try {
            deleteCardById(selectedCardId, user, dispatch, loginSuccess);
            toast.success('Xoá Card thành công!');
            setCards(prev => prev.filter(card => card.id !== selectedCardId));
            setConfirmOpen(false);
            setSelectedCardId(null);
            loadCards();
        } catch (err) {
            toast.error('Có lỗi xảy ra khi xoá Card!');
            console.error(err);
        }
    };

    if (!deck) return <Loading />;

    return (
        <div className={"deck-detail-container"}>
            <h1>{deck.name}</h1>
            <p className={"description"}>{deck.description}</p>
            <p><strong>Tổng số thẻ:</strong> {deck.stats.totalCards}</p>
            {deck.stats && (
                <div className="statistics">
                    <span>🆕 Thẻ mới: {deck.stats.totalNew}</span>
                    <span>🟢 Dễ: {deck.stats.totalEasy}</span>
                    <span>🔴 Khó: {deck.stats.totalHard}</span>
                    <span>📚 Cần học: {deck.stats.totalDue}</span>
                </div>
            )}

            <CompanionSelector
                selectedCharacters={companions}
                onChange={setCompanions}
            />

            <div className={"actions"}>
                <button onClick={() => setAddCardOpen(true)}>
                    ➕ Thêm Card
                </button>
                <button onClick={() => navigate(routeLink.study.replace(':deckId', deckId))}>
                    🚀 Bắt đầu học
                </button>
            </div>

            <div className={"cardList"}>
                {cards.map(card => (
                    <div key={card.id} className={"cardItem"}>
                        <div className={"frontBack"}>
                            <div><strong>Front:</strong> {card.front}</div>
                            <div><strong>Back:</strong> {card.back}</div>
                        </div>
                        <div className={"cardActions"}>
                            <button onClick={() => setEditCardId(card.id)}>✏️</button>
                            <button onClick={() => handleDeleteCard(card.id)}>🗑️</button>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {confirmOpen && (
                <ConfirmDialog
                    message="Bạn có chắc muốn xoá Card này không?"
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={confirmDelete}
                />
            )}

            {addCardOpen && (
                <CardFormModal
                    onClose={() => setAddCardOpen(false)}
                    onCardChanged={() => loadCards(currentPage)}
                />
            )}

            {editCardId && (
                <CardFormModal
                    onClose={() => setEditCardId(null)}
                    onCardChanged={() => loadCards(currentPage)}
                    cardId={editCardId} // Truyền cardId vào modal
                />
            )}
        </div>
    );
};

export default DeckDetailPage;
