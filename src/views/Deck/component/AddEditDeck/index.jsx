import './styles.scss';
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { createDeck, updateDeckById } from '../../../../api/deckApi';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../../../../redux/slice/auth';
import { routeLink } from '../../../../routes/AppRoutes';

const DeckFormPage = () => {
    const { deckId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.user);
    const dispatch = useDispatch();

    const isEdit = !!deckId;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Nếu sửa thì lấy dữ liệu sẵn
    useEffect(() => {
        if (isEdit) {
            // Nếu location.state đã có (từ DeckPage) thì dùng luôn
            if (location.state) {
                const { name, description } = location.state;
                setName(name);
                setDescription(description);
            } else {
                // Nếu truy cập trực tiếp qua URL
                // axios.get(`/api/decks/${deckId}`)
                //     .then(res => {
                //         setName(res.data.name);
                //         setDescription(res.data.description);
                //     })
                //     .catch(err => console.error(err));
            }
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
            navigate(routeLink.deck);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={"deck-form-container"}>
            <h2>{isEdit ? 'Edit Deck' : 'Create Deck'}</h2>
            <form onSubmit={handleSubmit} className={"deck-form"}>
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

                <button type="submit">{isEdit ? 'Update Deck' : 'Create Deck'}</button>
            </form>
        </div>
    );
};

export default DeckFormPage;
