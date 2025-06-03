import React, { useState, useEffect } from 'react';
import { loginSuccess } from '../../../../../redux/slice/auth';
import Reading from '../../../../../components/Reading/Reading';
import { getReadingsByUserId } from '../../../../../api/readingApi';
import { useSelector, useDispatch } from 'react-redux';
import Pagination from '../../../../../components/Pagination/index.jsx';

const ReadingTab = () => {
    const user = useSelector((state) => state.auth.login.user);
    const dispatch = useDispatch();
    const [readings, setReadings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchReadings = async () => {
            if (user) {
                try {
                    const params = {
                        page: currentPage - 1,
                        size: 2, // Số lượng truyện mỗi trang
                    }
                    const res = await getReadingsByUserId(user.id, params, user, dispatch, loginSuccess);
                    const data = res.data.content;
                    setReadings(data);
                    setTotalPages(res.data.totalPages);
                } catch (err) {
                    console.log(err);
                }
            }
        };
        fetchReadings();
    }, [user, dispatch, currentPage]);

    return (
        <div>
            {readings.length > 0 ? (
                readings.map((item, index) => (
                    <div key={index}>
                        <Reading data={item} />
                        <hr />
                    </div>
                ))
            ) : (
                <p>Không có truyện đang đọc.</p>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default ReadingTab;