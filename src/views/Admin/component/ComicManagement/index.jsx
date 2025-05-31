import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { REACT_APP_BASE_URL_API } from "../../../../constant/env";
import Pagination from "../../../../components/Pagination";
import apiMain from '../../../../api/apiMain';
import './styles.scss';

const ComicManagement = () => {
  const [comics, setComics] = useState([]);
  const [filteredComics, setFilteredComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const user = useSelector((state) => state.auth.login?.user);
  const token = user?.accessToken;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BASE_URL_API}/admin/comics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (Array.isArray(response.data)) {
          console.log("Comics data:", response.data.map(c => ({
            _id: c._id,
            name: c.name,
            status: c.status
          })));
          setComics(response.data);
          setFilteredComics(response.data);
        } else {
          setError("Dữ liệu trả về không phải mảng");
        }
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchComics();
    } else {
      setError("Không tìm thấy token xác thực");
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const filtered = comics.filter(comic => {
      const searchLower = searchTerm.toLowerCase();
      return (
        comic.name.toLowerCase().includes(searchLower) ||
        (comic.genre && comic.genre.toLowerCase().includes(searchLower)) ||
        (comic.uploader?.username && comic.uploader.username.toLowerCase().includes(searchLower))
      );
    });
    setFilteredComics(filtered);
    setCurrentPage(1);
  }, [searchTerm, comics]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedItems = () => {
    if (!sortConfig.key) return filteredComics;
    
    return [...filteredComics].sort((a, b) => {
      const aValue = a[sortConfig.key] || 0;
      const bValue = b[sortConfig.key] || 0;
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleDelete = async (url) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa truyện này?")) return;
    
    try {
      await axios.delete(`${REACT_APP_BASE_URL_API}/admin/comics/${url}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setComics(comics.filter(comic => comic.url !== url));
      
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : err.message;
      setError(errorMessage);
     
    }
  };

  const handleLock = async (comicId) => {

    try {
      await apiMain.updateComicStatus(comicId, 'LOCK', user, dispatch, null);
      setComics(comics.map(comic => 
        comic._id === comicId ? { ...comic, status: 'LOCK' } : comic
      ));

    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : err.message;
      setError(errorMessage);

    }
  };

  const handleUnlock = async (comicId) => {

    try {
      await apiMain.updateComicStatus(comicId, 'NONE', user, dispatch, null);
      setComics(comics.map(comic => 
        comic._id === comicId ? { ...comic, status: 'NONE' } : comic
      ));
      
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : err.message;
      setError(errorMessage);
      
    }
  };

  const sortedComics = getSortedItems();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedComics.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedComics.length / itemsPerPage);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;
  if (comics.length === 0) return <div>Không có truyện nào</div>;

  return (
    <div className="comic-list-container">
      <h1>Danh Sách Truyện</h1>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên truyện, thể loại hoặc người đăng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="table-responsive">
        <table className="comic-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Ảnh</th>
              <th>Tên Truyện</th>
              <th>Người Đăng</th>
              <th>Thể Loại</th>
              <th className="sortable" onClick={() => requestSort('views')}>
                Lượt Xem {sortConfig.key === 'views' && (
                  sortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </th>
              <th className="sortable" onClick={() => requestSort('rating')}>
                Đánh Giá {sortConfig.key === 'rating' && (
                  sortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((comic, index) => (
              <tr key={comic._id || index}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>
                  <img 
                    src={comic.image} 
                    alt={comic.name} 
                    className="comic-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/50";
                    }}
                  />
                </td>
                <td>{comic.name}</td>
                <td>{comic.uploader?.username || "Đang cập nhật"}</td>
                <td>{comic.genre || "Đang cập nhật"}</td>
                <td>{comic.views || 0}</td>
                <td>
                  {comic.rating?.toFixed(1) || 0}/5 
                  <br />
                  ({comic.ratingCount || 0} lượt)
                </td>
                <td>
                  <div className="action-buttons">
                    {comic.status === 'LOCK' ? (
                      <button 
                        className="unlock-btn"
                        onClick={() => handleUnlock(comic._id)}
                      >
                        Mở khóa
                      </button>
                    ) : (
                      <button 
                        className="lock-btn"
                        onClick={() => handleLock(comic._id)}
                      >
                        Khóa
                      </button>
                    )}
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(comic.url)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedComics.length > itemsPerPage && (
        <div className="pagination-container">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ComicManagement;