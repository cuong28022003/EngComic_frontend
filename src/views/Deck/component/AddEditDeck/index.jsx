import './styles.scss';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { createDeck, updateDeckById } from '../../../../api/deckApi';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../../../../redux/slice/auth';
import Modal from '../../../../components/Modal/index.jsx';
import { toast } from 'react-toastify';

const DeckFormModal = ({ onDeckCreated, deck, onClose }) => {
    const user = useSelector((state) => state.auth.login?.user);
    const dispatch = useDispatch();
    const isEdit = !!deck;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (isEdit) {
            setName(deck?.name);
            setDescription(deck?.description);
        }
    }, [deck, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { name, description };

        try {
            if (isEdit) {
                await updateDeckById(deck?.id, data, user, dispatch, loginSuccess)
                    .then((response) => {
                        toast.success('Cập nhật deck thành công');
                    }).catch((error) => {
                        console.error('Error updating deck:', error);
                        toast.error('Cập nhật deck thất bại');
                });
            } else {
                await createDeck(data, user, dispatch, loginSuccess)
                    .then((response) => {
                        toast.success('Tạo deck thành công');
                    }).catch((error) => {
                        console.error('Error creating deck:', error);
                        toast.error('Tạo deck thất bại');
                });
            }
            onDeckCreated();
            onClose();
        } catch (err) {
            console.error('Error saving deck:', err);
            alert('Có lỗi xảy ra khi lưu bộ thẻ');
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className="deck-form-container">
                <h2>{isEdit ? 'Chỉnh sửa Deck' : 'Tạo Deck'}</h2>
                <form onSubmit={handleSubmit} className="deck-form">
                    <div className='input-group'>
                        <label className='input-label'>
                            Tên <span>*</span>
                        </label>
                        <input
                            className='input'
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className='input-group'>
                        <label className='input-label'>
                            Mô tả:
                        </label>
                        <textarea
                            className='textarea'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="deck-form-buttons">
                        <button className='button-primary' type="submit">{isEdit ? 'Lưu Deck' : 'Tạo Deck'}</button>
                        <button className='button-outline' type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default DeckFormModal;