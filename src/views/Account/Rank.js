import Modal, { ModalContent } from '../../components/modal';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Pagination from "../../components/Pagination";
import { rankApi } from '../../api/rankApi';

function Rank() {
  const user = useSelector((state) => state.auth.login?.user);
  const [listRank, setListRank] = useState([]);
  const [currentRank, setCurrentRank] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [minXp, setMinXp] = useState(0);
  const [maxXp, setMaxXp] = useState(0);
  const [badge, setBadge] = useState(null);
  const [preview, setPreview] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const dispatch = useDispatch();

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listRank.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(listRank.length / itemsPerPage);

  // Load danh sách rank
  useEffect(() => {
    const loadRanks = async () => {
      try {
        const res = await rankApi.getAllRanks(user, dispatch, 'FETCH_RANKS_SUCCESS');
        setListRank(res);
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi tải danh sách rank');
      }
    };
    loadRanks();
  }, []);

  // Xử lý file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBadge(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Reset form
  const resetForm = () => {
    setName('');
    setMinXp(0);
    setMaxXp(0);
    setBadge(null);
    setPreview(null);
    setCurrentRank(null);
  };

  // Mở modal chỉnh sửa
  const onClickEdit = (rank) => {
    setCurrentRank(rank);
    setName(rank.name);
    setMinXp(rank.minXp);
    setMaxXp(rank.maxXp);
    setPreview(rank.badge);
    setIsEditing(true);
    setModalOpen(true);
  };

  // Mở modal tạo mới
  const onClickCreate = () => {
    resetForm();
    setIsEditing(false);
    setModalOpen(true);
  };

  // Đóng modal
  const closeModal = useCallback(() => {
    setModalOpen(false);
    resetForm();
  }, []);

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(badge);    // Kiểm tra xem badge đã được chọn chưa
    

    try {
      const rankData = { name, minXp, maxXp, badge: badge };
      
      if (isEditing) {
        await rankApi.updateRank(
          currentRank.id, 
          rankData,
          user, 
          dispatch, 
          'UPDATE_RANK_SUCCESS'
        );
        toast.success('Cập nhật rank thành công');
      } else {
        await rankApi.createRank(
          rankData,
          user, 
          dispatch, 
          'CREATE_RANK_SUCCESS'
        );
        toast.success('Tạo rank thành công');
      }
      
      // Load lại danh sách và đóng modal
      const res = await rankApi.getAllRanks(user, dispatch, 'FETCH_RANKS_SUCCESS');
      setListRank(res);
      closeModal();
    } catch (error) {
      toast.error(error.message || (isEditing ? 'Cập nhật rank thất bại' : 'Tạo rank thất bại'));
    }
  };

  // Xóa rank
  const onClickDelete = async (id) => {
    try {
      await rankApi.deleteRank(id, user, dispatch, 'DELETE_RANK_SUCCESS');
      const res = await rankApi.getAllRanks(user, dispatch, 'FETCH_RANKS_SUCCESS');
      setListRank(res);
      toast.success('Xóa rank thành công');
    } catch (err) {
      console.error(err);
      toast.error('Xóa rank thất bại');
    }
  };

  return (
    <>
      <div className="ranks-header">
        <h1>Danh sách Rank</h1>
        <button 
          onClick={onClickCreate} 
          className="btn btn-primary"
          style={{ marginLeft: 'auto' }}
        >
          Thêm Rank mới
        </button>
      </div>

      <table className="rank-table" style={{ width: '90%' }}>
        <thead>
          <tr>
            <th>Tên Rank</th>
            <th>XP tối thiểu</th>
            <th>XP tối đa</th>
            <th>Huy hiệu</th>
            <th>Chỉnh sửa</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((rank) => (
            <tr key={rank.id}>
              <td>{rank.name}</td>
              <td>{rank.minXp}</td>
              <td>{rank.maxXp}</td>
              <td>
                {rank.badge && (
                  <img 
                    src={`${rank.badge}`} 
                    alt="Huy hiệu" 
                    style={{ width: '50px', height: '50px' }}
                  />
                )}
              </td>
              <td>
                <button 
                  onClick={() => onClickEdit(rank)} 
                  className="btn btn-primary"
                >
                  Chỉnh sửa
                </button>
              </td>
              <td>
                <button 
                  onClick={() => onClickDelete(rank.id)} 
                  className="btn btn-danger"
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {listRank.length > itemsPerPage && (
        <div style={{ marginTop: '0px', display: 'flex', justifyContent: 'center' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {modalOpen && (
        <Modal active={modalOpen}>
          <ModalContent onClose={closeModal}>
            <div className="rank-form">
              <h3 style={{ textAlign: 'center' }}>
                {isEditing ? 'Chỉnh sửa Rank' : 'Tạo Rank mới'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tên Rank</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>XP tối thiểu</label>
                  <input
                    type="number"
                    value={minXp}
                    onChange={(e) => setMinXp(parseInt(e.target.value))}
                    required
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label>XP tối đa</label>
                  <input
                    type="number"
                    value={maxXp}
                    onChange={(e) => setMaxXp(parseInt(e.target.value))}
                    required
                    min={minXp + 1}
                  />
                </div>
                
                <div className="form-group">
                  <label>Huy hiệu</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required 
                  />
                  {preview && (
                    <img 
                      src={preview} 
                      alt="Preview" 
                      style={{ width: '100px', height: '100px', marginTop: '10px' }}
                    />
                  )}
                </div>
                
                <button type="submit" className={`btn ${isEditing ? 'btn-primary' : 'btn-success'}`}>
                  {isEditing ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </form>
            </div>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default Rank;