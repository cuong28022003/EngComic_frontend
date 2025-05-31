import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Pagination from "../../../../components/Pagination";
import { getAllRanks, createRank, updateRank, deleteRank } from '../../../../api/rankApi';
import './styles.scss';
import { getCharactersByVersion } from '../../../../api/characterApi';
import { loginSuccess } from '../../../../redux/slice/auth';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import ConfirmDialog from '../../../../components/ConfirmDialog'; // Đường dẫn tùy vị trí file
import Modal from '../../../../components/Modal/index.jsx'; // Đường dẫn tùy vị trí file
import GachaCard from '../../../../components/GachaCard'; // Đường dẫn tùy vị trí file

function RankManagement() {
  const user = useSelector((state) => state.auth.login?.user);
  const [listRank, setListRank] = useState([]);
  const [selectedRank, setSelectedRank] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [minXp, setMinXp] = useState(0);
  const [maxXp, setMaxXp] = useState(0);
  const [badge, setBadge] = useState(null);
  const [preview, setPreview] = useState(null);
  const [rewardDiamond, setRewardDiamond] = useState(0);
  const [rewardCharacterId, setRewardCharacterId] = useState("");
  const [characters, setCharacters] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const dispatch = useDispatch();

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listRank.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(listRank.length / itemsPerPage);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Load danh sách rank
  useEffect(() => {
    const loadRanks = async () => {
      try {
        const res = await getAllRanks();
        setListRank(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi tải danh sách rank');
      }
    };
    loadRanks();
  }, []);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await getCharactersByVersion("SEASON_1");
        setCharacters(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi tải danh sách nhân vật');
      }
    };
    fetchCharacters();
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
    setSelectedRank(null);
    setRewardDiamond(0);
    setRewardCharacterId("");
  };

  // Mở modal chỉnh sửa
  const onClickEdit = (rank) => {
    setSelectedRank(rank);
    setName(rank.name);
    setMinXp(rank.minXp);
    setMaxXp(rank.maxXp);
    setPreview(rank.badge);
    setRewardDiamond(rank.rewardDiamond || 0);
    setRewardCharacterId(rank.rewardCharacter.id || null);
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
  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify({
        name: name,
        minXp: minXp,
        maxXp: maxXp,
        rewardDiamond: rewardDiamond,
        rewardCharacterId: rewardCharacterId,
      })], { type: "application/json" }));
      
      if (badge) {
        formData.append("image", badge);
      }

      if (isEditing) {
        await updateRank(
          selectedRank.id,
          formData,
          user,
          dispatch,
          loginSuccess
        );
        toast.success('Cập nhật rank thành công');
      } else {
        await createRank(
          formData,
          user,
          dispatch,
          loginSuccess
        );
        toast.success('Tạo rank thành công');
      }

      // Load lại danh sách và đóng modal
      const res = await getAllRanks();
      setListRank(res.data);
      closeModal();
    } catch (error) {
      toast.error(error.message || (isEditing ? 'Cập nhật rank thất bại' : 'Tạo rank thất bại'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (rank) => {
    setSelectedRank(rank);
    setConfirmOpen(true);
  };

  // Xóa rank
  const handleDeleteRank = async (id) => {
    try {
      // setIsSubmitting(true);
      await deleteRank(id, user, dispatch, loginSuccess);
      const res = await getAllRanks();
      toast.success('Xóa rank thành công');
      setListRank(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Xóa rank thất bại');
    } finally {
      // setIsSubmitting(false);
      setConfirmOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedRank(null);
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
            <th>Thưởng kim cương</th>
            <th>Thưởng nhân vật</th>
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
              <td>{rank.rewardDiamond}</td>
              <td>
                {rank.rewardCharacter && (
                  <GachaCard character={rank?.rewardCharacter} size="small" />
                )}
              </td>
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
                  onClick={() => handleDeleteClick(rank)}
                  className="btn btn-danger"
                  disabled={isSubmitting}
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmOpen && (
        <ConfirmDialog
          message="Bạn có chắc chắn muốn xóa rank này không?"
          onConfirm={() => handleDeleteRank(selectedRank.id)}
          onCancel={handleCancelDelete}
        />
      )}

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
        <Modal onClose={closeModal}>
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
                    required={!isEditing}
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ width: '100px', height: '100px', marginTop: '10px' }}
                    />
                  )}
                </div>

                <div className="form-group">
                  <label>Reward Kim cương</label>
                  <input
                    type="number"
                    value={rewardDiamond}
                    onChange={(e) => setRewardDiamond(parseInt(e.target.value))}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Reward Nhân vật</label>
                  <select
                    value={rewardCharacterId}
                    onChange={(e) => setRewardCharacterId(e.target.value)}
                    required
                  >
                    <option value="">-- Chọn nhân vật --</option>
                    {characters.map((char) => (
                      <option key={char.id} value={char.id}>
                        {char.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className={`btn ${isEditing ? 'btn-primary' : 'btn-success'}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner className="me-2" size="sm" />
                      Đang xử lý...
                    </>
                  ) : (
                    isEditing ? 'Cập nhật' : 'Tạo mới'
                  )}
                </button>
              </form>
            </div>
        </Modal>
      )}
    </>
  );
}

export default RankManagement;