import { useEffect, useState } from "react";
import DeckCard from "./component/DeckCard";
import { useNavigate } from "react-router-dom";
import { deleteDeckById, getDecksByUserId } from "../../api/deckApi";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/auth";
import './styles.scss';
import { routeLink } from "../../routes/AppRoutes";
import ConfirmDialog from "../../components/ConfirmDialog";
import { toast } from "react-toastify";
import DeckFormModal from "./component/AddEditDeck";

const DeckPage = () => {
    const [decks, setDecks] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedDeckId, setSelectedDeckId] = useState(null);
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.user);
    const dispatch = useDispatch();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingDeck, setEditingDeck] = useState(null);

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const response = await getDecksByUserId(user.id, user, dispatch, loginSuccess);
                setDecks(response.data.content || []);
            } catch (error) {
                console.error("Error fetching decks:", error);
            }
        };
        fetchDecks();
    }, []);

    const handleDeckCreated = async () => {
        // Sau khi tạo/sửa, reload lại danh sách deck
        try {
            const response = await getDecksByUserId(user.id, user, dispatch, loginSuccess);
            setDecks(response.data.content || []);
        } catch (error) {
            console.error("Error fetching decks:", error);
        }
        setModalOpen(false);
        setEditingDeck(null);
    };

    const handleClickDeck = (deckId) => {
        navigate(routeLink.deckDetail.replace(':deckId', deckId));
    };

    const handleAddDeck = () => {
        setEditingDeck(null);
        setModalOpen(true);
    };

    const handleEditDeck = (deck) => {
        setEditingDeck(deck);
        setModalOpen(true);
    };

    const handleDeleteDeck = (deckId) => {
        setSelectedDeckId(deckId);
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedDeckId) return;

        deleteDeckById(selectedDeckId, user, dispatch, loginSuccess)
            .then(() => {
                setDecks(prev => prev.filter(d => d.id !== selectedDeckId));
                setConfirmOpen(false);
                setSelectedDeckId(null);
                toast.success("Xóa deck thành công!");
            })
            .catch(err => {
                console.error(err)
                toast.error("Xóa deck thất bại!");
            });
    };

    return (
        <div className={"deck-container"}>
            <h1>Your Decks</h1>
            <button className={"addButton"} onClick={handleAddDeck}>
                ➕ Create New Deck
            </button>

            <div className={"deckGrid"}>
                {decks.map((deck) => (
                    <DeckCard
                        key={deck.id}
                        deck={deck}
                        onClick={handleClickDeck}
                        onEdit={() => handleEditDeck(deck)}
                        onDelete={handleDeleteDeck}
                    />
                ))}
            </div>

            {modalOpen && (
                <DeckFormModal
                    onDeckCreated={handleDeckCreated}
                    deck={editingDeck}
                    onClose={() => setModalOpen(false)}
                />
            )}

            {confirmOpen && (
                <ConfirmDialog
                    message="Bạn có chắc muốn xoá Deck này không?"
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
};

export default DeckPage;
