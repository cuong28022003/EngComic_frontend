import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { REACT_APP_BASE_URL_API } from "../../constant/env";

const ComicList = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.login?.user);

  // Token giả sử được lưu trong localStorage
  const token = user.accessToken; // Hoặc nơi lưu token của bạn

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BASE_URL_API}/admin/comics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComics(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, [token]);

  const handleDelete = async (url) => {
    try {
      await axios.delete(`${REACT_APP_BASE_URL_API}/admin/comics/${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Danh Sách Truyện</h1>
      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Hình ảnh</th>
            <th>Người tải lên</th>
            <th>Artist</th>
            <th>Lượt xem</th>
            <th>Đánh giá</th>
            <th>Số lượt đánh giá</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {comics.map((comic) => (
            <tr key={comic.id.timestamp}>
              <td>{comic.name}</td>
              <td>
                <img
                  src={comic.image}
                  alt={comic.name}
                  style={{ width: "100px", height: "auto" }}
                />
              </td>
              
              <td>{comic.artist}</td>
              <td>{comic.views}</td>
              <td>{comic.rating}</td>
              <td>{comic.ratingCount}</td>
              <td>
                <button 
                  onClick={() => handleDelete(comic.url)} 
                  style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComicList;
