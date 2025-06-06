import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './styles.scss';
import { createCard, getCardById, updateCardById } from '../../../../api/cardApi';
import { loginSuccess } from '../../../../redux/slice/auth';
import { routeLink } from '../../../../routes/AppRoutes';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../../components/Modal/index.jsx';
import { toast } from 'react-toastify';

const CardFormModal = ({ onClose, onCardChanged, cardId }) => {
    const { deckId } = useParams();
    const user = useSelector(state => state.auth.login?.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isEdit = !!cardId;

    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [ipa, setIpa] = useState('');

    useEffect(() => {
        if (isEdit) {
            getCardById(cardId, user, dispatch, loginSuccess)
                .then(res => {
                    setFront(res.data.front);
                    setBack(res.data.back);
                    setIpa(res.data.ipa || '');
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
                ipa: ipa,
            }
            if (isEdit) {
                await updateCardById(cardId, data, user, dispatch, loginSuccess);
                toast.success('Cập nhật thẻ thành công!');
            } else {
                await createCard(data, user, dispatch, loginSuccess);
                toast.success('Tạo thẻ mới thành công!');
            }
            if (onCardChanged) {
                onCardChanged();
            }
            onClose();
        } catch (err) {
            toast.error('Có lỗi xảy ra!');
            console.error(err);
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className={"card-form-container"}>
                <h2>{isEdit ? 'Sửa Card' : 'Tạo Card Mới'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label className='input-label'>
                            Front:
                        </label>
                        <textarea className='textarea' value={front} onChange={(e) => setFront(e.target.value)} />

                    </div>
                    <div className='input-group'>
                        <label className='input-label'>
                            Back:
                        </label>
                        <textarea className='textarea' value={back} onChange={(e) => setBack(e.target.value)} />

                    </div>
                    <div className='input-group'>
                        <label className='input-label'>
                            IPA:
                        </label>
                        <textarea className='textarea' value={ipa} onChange={(e) => setIpa(e.target.value)} />

                    </div>
                    <button className='button-primary' type="submit">Lưu</button>
                </form>
            </div>
        </Modal>
    );
};

export default CardFormModal;
