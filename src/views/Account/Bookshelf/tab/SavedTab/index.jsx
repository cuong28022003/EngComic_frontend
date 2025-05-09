import React, { useState, useEffect } from 'react';
import { loginSuccess } from '../../../../../redux/slice/auth';
import { getSavedComics } from '../../../../../api/savedApi';
import Saved from '../../../../../components/Saved';
import { useDispatch, useSelector } from 'react-redux';

const SavedTab = () => {
    const user = useSelector((state) => state.auth.login.user);
    const dispatch = useDispatch();
    const [savedComics, setSavedComics] = useState([]);

    // Lấy danh sách truyện đã lưu từ API
    useEffect(() => {
        if (user) {
            const fetchSavedComics = async () => {
                try {
                    const response = await getSavedComics(
                        user,
                        dispatch,
                        loginSuccess
                    );
                    console.log(response);
                    setSavedComics(response);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchSavedComics();
        }
    }, [user]);

    return (
        <div className="saved-list">
            {savedComics.length > 0 ? (
                savedComics.map((comic) => (
                    <div key={comic.id}>
                        <Saved data={comic} />
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