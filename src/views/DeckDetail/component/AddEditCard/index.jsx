import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './styles.scss';
import { createCard, getCardById, updateCardById } from '../../../../api/cardApi';
import { loginSuccess } from '../../../../redux/slice/auth';
import { routeLink } from '../../../../routes/AppRoutes';
import { useDispatch, useSelector } from 'react-redux';

const CardFormPage = () => {
    const { deckId, cardId } = useParams();
    const user = useSelector(state => state.auth.login?.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isEdit = !!cardId;

    const [front, setFront] = useState('');
    const [back, setBack] = useState('');

    useEffect(() => {
        if (isEdit) {
            getCardById(cardId, user, dispatch, loginSuccess)
                .then(res => {
                    setFront(res.data.front);
                    setBack(res.data.back);
                })
                .catch(err => console.error(err));
        }
    }, [cardId, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                deckId: deckId,
                front: front,
                back: back,
            }
            if (isEdit) {
                await updateCardById(cardId, data, user, dispatch, loginSuccess);
            } else {
                await createCard(data, user, dispatch, loginSuccess);
            }
            navigate(routeLink.deckDetail.replace(':deckId', deckId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={"card-form-container"}>
            <h2>{isEdit ? 'Sửa Card' : 'Tạo Card Mới'}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Front:
                    <textarea value={front} onChange={(e) => setFront(e.target.value)} />
                </label>
                <label>
                    Back:
                    <textarea value={back} onChange={(e) => setBack(e.target.value)} />
                </label>
                <button type="submit">Lưu</button>
            </form>
        </div>
    );
};

export default CardFormPage;
