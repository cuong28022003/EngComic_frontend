import React, { useState, useEffect } from 'react';
import { loginSuccess } from '../../../../../redux/slice/auth';
import { getSavedComics as getSavedComicsByUserId } from '../../../../../api/savedApi';
import Saved from '../../../../../components/Saved';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const SavedTab = ({ isReadOnly }) => {
    const { userId } = useParams();
    const user = useSelector((state) => state.auth.login.user);
    const dispatch = useDispatch();
    const [savedComics, setSavedComics] = useState([]);

    // Lấy danh sách truyện đã lưu từ API
    useEffect(() => {
        if (user) {
            const fetchSavedComics = async () => {
                try {
                    const response = await getSavedComicsByUserId(
                        userId || user.id,
                        user,
                        dispatch,
                        loginSuccess
                    );
                    setSavedComics(response.data.content);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchSavedComics();
        }
    }, [userId, user]);

    return (
        <div className="saved-list">
            {savedComics.length > 0 ? (
                savedComics.map((saved) => (
                    <div key={saved.id}>
                        <Saved saved={saved} isReadOnly={isReadOnly} />
                        <hr />
                    </div>
                ))
            ) : (
                <p>Chưa có truyện nào được đánh dấu.</p>
            )}
        </div>
    );
};

export default SavedTab;