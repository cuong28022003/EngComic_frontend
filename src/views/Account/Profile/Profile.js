import React, { useState, useEffect } from "react";
import { loginSuccess } from "../../../redux/slice/auth";
import { useSelector, useDispatch } from "react-redux";
import avt from "../../../assets/image/avt.png";
import { storage } from "../../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { setLoading } from "../../../redux/messageSlice";
import Loading from "../../../components/Loading/Loading";
import LoadingData from "../../../components/Loading/LoadingData";
import getData from "../../../api/getData";
import { updateUserInfo } from "../../../api/userApi";
import "./styles.scss";
import { useOutletContext, useParams } from "react-router-dom";
import { getUserById } from "../../../api/userApi";
import Avatar from "../../../components/Avatar";
import { updateUser } from "../../../redux/slice/auth";

function Profile() {
  const { isReadOnly } = useOutletContext();
  const { viewedUser } = useOutletContext();
  const { viewedUserStats } = useOutletContext();
  const { userId } = useParams();
  const loggedUser = useSelector((state) => state.auth.login?.user);
  const user = isReadOnly ? viewedUser : loggedUser; // Lấy thông tin user đang đăng nhập hoặc người dùng khác nếu isReadOnly
  const userStats = useSelector((state) => state.userStats.data);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [preview, setPreview] = useState(user?.imageUrl || avt);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [birthday, setBirthday] = useState(user?.birthday || new Date().toISOString().substring(0, 10));
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("birthday", birthday);
      formData.append("image", uploadedImage);

      const response = await updateUserInfo(
        user.id,
        formData,
        user,
        dispatch,
        loginSuccess,
      );
      dispatch(updateUser(response.data));
      toast.success("Cập nhật thành công!");
      // Có thể reload lại user nếu cần
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const onChangeFullName = (e) => setFullName(e.target.value);

  const onChangeBirthDate = (e) => {
    try {
      const date = new Date(e.target.value);
      const regex = new RegExp(
        "([0-9]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))"
      );
      if (regex.test(date.toISOString().substring(0, 10))) {
        setBirthday(date);
      } else {
        setBirthday(new Date());
      }
    } catch {
      setBirthday(new Date());
    }
  };

  const onChangeImage = (e) => {
    if (e.target.files.length !== 0) {
      setUploadedImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <>
        <div className="profile__wrap d-flex">
          <div className="col-5">
            <div className="profile__avatar">
              <Avatar src={preview} userStats={isReadOnly ? viewedUserStats: userStats} size={180} />

              {!isReadOnly && ( // Ẩn input tải ảnh lên nếu isReadOnly là true
                <input
                  type="file"
                  accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                  name="avatar"
                  onChange={onChangeImage}
                />
              )}
            </div>
          </div>
          <div className="col-7">
            <div className="profile__main">
              <form className="form-profile">
                <div className="group-info">
                  <label htmlFor="fullName">Tên hiển thị</label>
                  <input
                    id="fullName"
                    type="text"
                    onChange={onChangeFullName}
                    value={fullName}
                    readOnly={isReadOnly}
                  />
                </div>
                <div className="group-info">
                  <label>Email</label>
                  <input readOnly value={user?.email || ""} />
                </div>
                <div className="group-info">
                  <label htmlFor="birthday">Ngày sinh</label>
                  <input
                    onChange={onChangeBirthDate}
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={birthday}
                    readOnly={isReadOnly}
                  />
                </div>
                {!isReadOnly && (
                  <button onClick={handleEdit}>
                    {loading ? <Loading /> : "Cập nhật"}
                  </button>
                )}
              </form>

            </div>
          </div>
        </div>
    </>
  );
}

export default Profile;
