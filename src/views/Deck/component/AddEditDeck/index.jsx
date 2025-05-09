import './styles.scss';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { createDeck, updateDeckById } from '../../../../api/deckApi';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../../../../redux/slice/auth';

const DeckFormPage = ({ onDeckCreated, onClose, deckId: propDeckId }) => {
    const { deckId: paramDeckId } = useParams();
    const location = useLocation();
    const user = useSelector((state) => state.auth.login?.user);
    const dispatch = useDispatch();

    const deckId = propDeckId || paramDeckId;
    const isEdit = !!deckId;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (isEdit && location.state) {
            const { name, description } = location.state;
            setName(name);
            setDescription(description);
        }
    }, [deckId, isEdit, location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { name, description };

        try {
            if (isEdit) {
                await updateDeckById(deckId, data, user, dispatch, loginSuccess);
            } else {
                await createDeck(data, user, dispatch, loginSuccess);
            }
            onDeckCreated();
            onClose();
        } catch (err) {
            console.error('Error saving deck:', err);
            alert('Có lỗi xảy ra khi lưu bộ thẻ');
        }
    };

    return (
        <div className="deck-form-container">
            <h2>{isEdit ? 'Edit Deck' : 'Create Deck'}</h2>
            <form onSubmit={handleSubmit} className="deck-form">
                <label>
                    Deck Name <span>*</span>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>

                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>

                <div className="deck-form-buttons">
                    <button type="submit">{isEdit ? 'Update Deck' : 'Create Deck'}</button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DeckFormPage;