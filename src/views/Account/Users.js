import Modal, { ModalContent } from '../../components/modal';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import apiMain from '../../api/apiMain';
import { loginSuccess } from '../../redux/authSlice';
import { toast } from 'react-toastify';
import './Users.css';

function Users(props) {
  const user = useSelector((state) => state.auth.login?.user);
  const [listUser, setListUser] = useState([]);
  const [roles, setRoles] = useState([]);
  const [username, setUsername] = useState(''); // Đổi từ id sang username
  const [modalRole, setModalRole] = useState(false);
  const dispatch = useDispatch();

  const onClickRole = (username, userRoles) => {
    setModalRole(true);
    setRoles(userRoles.length === 0 ? [] : userRoles.split(', '));
    setUsername(username); // Lưu username vào state
  };

  const onClickDelete = async (username) => {
    try {
        await apiMain.deleteAccount(user, dispatch, loginSuccess, { id: username });
        loadUsers(); // Tải lại danh sách người dùng
        toast.success('Xóa tài khoản thành công');
    } catch (err) {
        console.error(err);
        toast.error('Xóa tài khoản thất bại');
    }
  };

  const onClickToggleActive = async (userId, isActive, username) => {
    const action = isActive ? apiMain.inactiveByAdmin : apiMain.activeByAdmin;

    action(user, dispatch, loginSuccess, { username }) // Sử dụng username
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
  });

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

  return (
    <>
      <h1>Danh sách tài khoản</h1>

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
          {listUser.map((item) => (
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
      {modalRole && (
        <Modal active={modalRole}>
          <ModalContent onClose={closeModalRole}>
            <ChooseRoles roles={roles} username={username} /> {/* Truyền username */}
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
    const params = { roles, username: props.username }; // Sử dụng username
    apiMain
      .updateRole(user, dispatch, loginSuccess, params)
      .then(() => {
        toast.success('Cập nhật quyền thành công', {
          hideProgressBar: true,
          autoClose: 1200,
          pauseOnHover: false,
        });
        window.location.reload();
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