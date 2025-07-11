import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { REACT_APP_BASE_URL_API } from "../../../../constant/env";
import Pagination from "../../../../components/Pagination/index";
import apiMain from '../../../../api/apiMain';
import './styles.scss';
import { deleteComic, getComics, getComicsAdmin } from "../../../../api/comicApi";
import ConfirmDialog from "../../../../components/ConfirmDialog";
import { loginSuccess } from "../../../../redux/slice/auth";
import { toast } from "react-toastify";
import { set } from "lodash";
import Loading from "../../../../components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import { routeLink } from "../../../../routes/AppRoutes";

const ComicManagement = () => {
  const navigate = useNavigate();
  const [comics, setComics] = useState([]);
  const [filteredComics, setFilteredComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const user = useSelector((state) => state.auth.login?.user);
  const dispatch = useDispatch();

  const [showConfirm, setShowConfirm] = useState(false);
  const [comicToDelete, setComicToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');


  useEffect(() => {
    const fetchComics = async () => {
      try {
        const params = {
          page: 0,
          size: 1000, // Lấy tất cả truyện để quản lý
        }
        const response = await getComicsAdmin(params);
        setComics(response.data.content);
        setFilteredComics(response.data.content)
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComics();
  }, []);

  useEffect(() => {
    const filtered = comics.filter(comic => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        comic.name.toLowerCase().includes(searchLower) ||
        (comic.genre && comic.genre.toLowerCase().includes(searchLower)) ||
        (comic.uploader?.username && comic.uploader.username.toLowerCase().includes(searchLower))
      );
      const matchesStatus = statusFilter === '' || comic.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredComics(filtered);
    setCurrentPage(1);
  }, [searchTerm, comics, statusFilter]);

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

  const handleDeleteClick = (comicId) => {
    setComicToDelete(comicId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!comicToDelete) return;
    try {
      setLoading(true);
      await deleteComic(comicToDelete, user, dispatch, loginSuccess);
      setComics(comics.filter(comic => comic.id !== comicToDelete));
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      setLoading(false);
      toast.success("Xóa truyện thành công!");
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response ? err.response.data.message : err.message;
      setError(errorMessage);
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setShowConfirm(false);
      setComicToDelete(null);
    }
  };

  const handleLock = async (comicId) => {

    try {
      await apiMain.updateComicStatus(comicId, 'LOCK', user, dispatch, null);
      setComics(comics.map(comic =>
        comic.id === comicId ? { ...comic, status: 'LOCK' } : comic
      ));

    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : err.message;
      setError(errorMessage);

    }
  };

  const handleUnlock = async (comicId) => {

    try {
      await apiMain.updateComicStatus(comicId, 'ACTIVE', user, dispatch, null);
      setComics(comics.map(comic =>
        comic.id === comicId ? { ...comic, status: 'ACTIVE' } : comic
      ));

    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : err.message;
      setError(errorMessage);

    }
  };

  const handleApprove = async (comicId) => {
    try {
      await apiMain.updateComicStatus(comicId, 'ACTIVE', user, dispatch, null);
      setComics(comics.map(comic =>
        comic.id === comicId ? { ...comic, status: 'ACTIVE' } : comic
      ));
      toast.success("Duyệt truyện thành công!");
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : err.message;
      setError(errorMessage);
      toast.error(`Lỗi: ${errorMessage}`);
    }
  };
  

  const sortedComics = getSortedItems();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedComics.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedComics.length / itemsPerPage);

  if (loading) return <Loading />;
  if (error) return <div className="error">Lỗi: {error}</div>;
  if (comics.length === 0) return <div>Không có truyện nào</div>;

  return (
    <div className="comic-list-container">
      <h1>Danh Sách Truyện</h1>

      <div className="control-bar">
        <div className="search-bar">
          <input
            className="input"
            type="text"
            placeholder="Tìm kiếm theo tên truyện, thể loại hoặc người đăng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-bar">
          <label htmlFor="status-filter">Lọc theo trạng thái:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="LOCK">Đã khóa</option>
          </select>
        </div>
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
              <th>Trạng thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((comic, index) => (
              <tr key={comic.id || index}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>
                  <img
                    src={comic.imageUrl}
                    alt={comic.name}
                    className="comic-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/50";
                    }}
                  />
                </td>
                <td>
                  <span
                    className="comic-name-link"
                    onClick={() => navigate(routeLink.comicDetail.replace(':comicId', comic.id))}
                  >
                    {comic.name}
                  </span>
                </td>
                <td>{comic.uploader?.username || "Đang cập nhật"}</td>
                <td>{comic.genre || "Đang cập nhật"}</td>
                <td>{comic.views || 0}</td>
                <td>
                  {comic.rating?.toFixed(1) || 0}/5
                  <br />
                  ({comic.totalRatings || 0} lượt)
                </td>
                <td>{comic.status || "Đang cập nhật"}</td>
                <td>
                  <div className="action-buttons">

                    {comic.status === 'PENDING' && (
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(comic.id)}
                      >
                        Duyệt
                      </button>
                    )}
                    {comic.status !== 'PENDING' && (comic.status === 'LOCK' ? (
                      <button
                        className="unlock-btn"
                        onClick={() => handleUnlock(comic.id)}
                      >
                        Mở khóa
                      </button>
                    ) : (
                      <button
                        className="lock-btn"
                        onClick={() => handleLock(comic.id)}
                      >
                        Khóa
                      </button>
                    ))}
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(comic.id)}
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

      {showConfirm && (
        <ConfirmDialog
          message="Bạn chắc chắn muốn xóa truyện này?"
          onConfirm={handleConfirmDelete}
          onCancel={() => { setShowConfirm(false); setComicToDelete(null); }}
        />
      )}
    </div>
  );
};

export default ComicManagement;