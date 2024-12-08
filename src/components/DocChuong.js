import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DocChuong = ({ chuongId }) => {
    const [chuong, setChuong] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChuong = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/chuong/${chuongId}`);
                setChuong(response.data);
            } catch (err) {
                setError("Không thể tải chương truyện.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchChuong();
    }, [chuongId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!chuong) {
        return <p>Không tìm thấy chương truyện.</p>;
    }

    return (
        <div>
            <h1>{chuong.tieuDe}</h1>
            <div>
                {chuong.danhSachAnh.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Trang ${index + 1}`}
                        style={{ width: "100%", marginBottom: "20px" }}
                    />
                ))}
            </div>
        </div>
    );
};

export default DocChuong;
