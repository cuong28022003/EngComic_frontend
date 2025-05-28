import Modal, { ModalContent } from '../../components/modal';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import apiMain from '../../api/apiMain';
import { loginSuccess } from '../../redux/slice/auth';
import { toast } from 'react-toastify';
import './Users.scss';
import Pagination from "../../components/Pagination/index";

function Users(props) {
  const user = useSelector((state) => state.auth.login?.user);
  const [listUser, setListUser] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // State cho danh sách người dùng đã lọc
  const [roles, setRoles] = useState([]);
  const [username, setUsername] = useState('');
  const [modalRole, setModalRole] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State cho giá trị tìm kiếm
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const dispatch = useDispatch();

  // Tính toán phân trang dựa trên danh sách đã lọc
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Hàm lọc người dùng dựa trên searchTerm
  useEffect(() => {
    const filtered = listUser.filter((item) =>
      item.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  }, [searchTerm, listUser]);

  // Xử lý thay đổi input tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onClickRole = (username, userRoles) => {
    setModalRole(true);
    setRoles(userRoles.length === 0 ? [] : userRoles.split(', '));
    setUsername(username);
  };

  const onClickDelete = async (username) => {
    try {
      await apiMain.deleteAccount(user, dispatch, loginSuccess, { id: username });
      loadUsers();
      toast.success('Xóa tài khoản thành công');
    } catch (err) {
      console.error(err);
      toast.error('Xóa tài khoản thất bại');
    }
  };

  const onClickToggleActive = async (userId, isActive, username) => {
    const action = isActive ? apiMain.inactiveByAdmin : apiMain.activeByAdmin;

    action(user, dispatch, loginSuccess, { username })
      .then((res) => {
        loadUsers();
        toast.success(isActive ? 'Khoá tài khoản thành công' : 'Kích hoạt tài khoản thành công');
      })
      .catch((err) => {
        toast.error(isActive ? 'Khoá tài khoản thất bại' : 'Kích hoạt tài khoản thất bại');
      });
  };

  const closeModalRole = useCallback(() => {
    setModalRole(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    apiMain
      .getAllUser(user, props.dispatch, loginSuccess)
      .then((res) => {
        setListUser(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleRoleUpdated = useCallback(() => {
    loadUsers();
    setModalRole(false);
  }, []);

  return (
    <>
      <div className="users-header">
        <h1>Danh sách tài khoản</h1>
        <div className="search-bar" style={{ marginLeft: 'auto' }}>
          <input
            type="text"
            placeholder="Điền tên đăng nhập cần tìm..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ padding: '8px', width: '250px' }}
          />
        </div>
      </div>

      <table className="user-table" style={{ width: '90%' }}>
        <thead>
          <tr>
            <th>Tên đăng nhập</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Quyền hạn</th>
            <th>Kích hoạt/Khóa</th>
            <th>Cấp quyền</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item._id}>
              <td>{item.username}</td>
              <td>{item.email}</td>
              <td>{item.active ? 'Đã kích hoạt' : 'Chưa kích hoạt'}</td>
              <td>{item.roles?.map((e) => e.name).join(', ') || ''}</td>
              <td>
                <button
                  onClick={() => onClickToggleActive(item._id, item.active, item.username)}
                  className={`btn ${item.active ? 'btn-danger' : 'btn-success'}`}>
                  {item.active ? 'Khoá' : 'Kích hoạt'}
                </button>
              </td>
              <td>
                <button onClick={() => onClickRole(item.username, item.roles?.map((e) => e.name).join(', '))} className="btn btn-primary">
                  Cấp quyền
                </button>
              </td>
              <td>
                <button onClick={() => onClickDelete(item.username)} className="btn btn-warning">
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredUsers.length > itemsPerPage && (
        <div style={{ marginTop: '0px', display: 'flex', justifyContent: 'center' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
      {modalRole && (
        <Modal active={modalRole}>
          <ModalContent onClose={closeModalRole}>
            <ChooseRoles 
              roles={roles} 
              username={username}
              onSuccess={handleRoleUpdated}
            />
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

const roleBase = ['ADMIN', 'USER'];

const ChooseRoles = (props) => {
  const user = useSelector((state) => state.auth.login?.user);
  const [roles, setRoles] = useState(props.roles);
  const dispatch = useDispatch();

  const onClickUpdateRole = async (e) => {
    e.preventDefault();
    const params = { roles, username: props.username };
    apiMain
      .updateRole(user, dispatch, loginSuccess, params)
      .then(() => {
        toast.success('Cập nhật quyền thành công', {
          hideProgressBar: true,
          autoClose: 1200,
          pauseOnHover: false,
        });
        props.onSuccess();
      })
      .catch((err) => {
        toast.error(err.response?.details?.message || 'Cập nhật quyền thất bại', {
          hideProgressBar: true,
          autoClose: 1200,
          pauseOnHover: false,
        });
      });
  };

  const onClickChooseRole = (e) => {
    const role = e.target.name;
    if (roles.includes(role)) {
      const newRoles = roles.filter((r) => r !== role);
      if (newRoles.length === 0) {
        toast.warning('Phải chọn ít nhất một quyền', { hideProgressBar: true, autoClose: 1200 });
        return;
      }
      setRoles(newRoles);
    } else {
      setRoles([...roles, role]);
    }
  };

  return (
    <div>
      <form className="choose-roles" action="">
        <h3 style={{ textAlign: 'center' }}>Chọn quyền</h3>
        {roleBase.map((item) => (
          <label key={item} htmlFor={item} onClick={onClickChooseRole} name={item} className="remember-label">
            {item}
            <input name={item} readOnly type="checkbox" checked={roles.includes(item)} id={item} />
            <span className="checkmark"></span>
          </label>
        ))}
        <button onClick={onClickUpdateRole}>Cấp quyền</button>
      </form>
    </div>
  );
};

export default Users;