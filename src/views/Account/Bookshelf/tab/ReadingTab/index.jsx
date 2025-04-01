import React, { useState, useEffect } from 'react';
import { loginSuccess } from '../../../../../redux/slice/auth';
import Reading from '../../../../../components/Reading/Reading';
import { getReadings } from '../../../../../api/readingApi';

const ReadingTab = ({ dispatch, user }) => {
    const [readings, setReadings] = useState([]);
    useEffect(async () => {
        if (user) {
            getReadings(user, dispatch, loginSuccess)
                .then((res) => {
                    console.log(res);
                    setReadings(res.data.content);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    return (
        <div>
            {readings.length > 0 ? (
                readings.map((item, i) => (
                    <div key={item._id}>
                        <Reading data={item} />
                        <hr />
                    </div>
                ))
            ) : (
                <p>Không có truyện đang đọc.</p>
            )}
        </div>
    );
};

export default ReadingTab;