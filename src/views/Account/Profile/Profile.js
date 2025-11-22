import React, { useState, useEffect } from "react";
import { loginSuccess } from "../../../redux/slice/auth";
import { useSelector, useDispatch } from "react-redux";
import avt from "../../../assets/image/avt.png";
import { storage } from "../../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { setLoading } from "../../../redux/messageSlice";
import Loading from "../../../components/Loading";
import LoadingData from "../../../components/LoadingData";
import getData from "../../../api/getData";
import { updateUserInfo } from "../../../api/userApi";
import "./styles.scss";
import { useOutletContext, useParams } from "react-router-dom";
import { getUserById } from "../../../api/userApi";
import Avatar from "../../../components/Avatar";
import { updateUser } from "../../../redux/slice/auth";
import { enableAdultMode, disableAdultMode } from "../../../redux/slice/adultMode";
import { isAdult, calculateAge } from "../../../utils/ageUtils";
import AdultModeConfirmDialog from "../../../components/AdultModeConfirmDialog";

function Profile() {
  const { isReadOnly } = useOutletContext();
  const { viewedUser } = useOutletContext();
  console.log("viewedUser", viewedUser);
  const { viewedUserStats } = useOutletContext();
  const { userId } = useParams();
  const loggedUser = useSelector((state) => state.auth.login?.user);
  const isAdultModeEnabled = useSelector((state) => state.adultMode.isAdultModeEnabled);
  const user = isReadOnly ? viewedUser : loggedUser; // Lấy thông tin user đang đăng nhập hoặc người dùng khác nếu isReadOnly
  const userStats = useSelector((state) => state.userStats.data);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [preview, setPreview] = useState(user?.imageUrl || avt);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [birthday, setBirthday] = useState(user?.birthday || new Date().toISOString().substring(0, 10));
  const [loading, setLoading] = useState(false);
  const [showAdultModeConfirm, setShowAdultModeConfirm] = useState(false);
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

  // Adult mode functions
  const userAge = calculateAge(user?.birthday);
  const userIsAdult = isAdult(user?.birthday);

  const handleAdultModeToggle = () => {
    if (isAdultModeEnabled) {
      // Tắt adult mode
      dispatch(disableAdultMode());
      toast.success("Đã tắt chế độ người lớn");
    } else {
      // Bật adult mode - hiển thị confirm dialog
      setShowAdultModeConfirm(true);
    }
  };

  const handleAdultModeConfirm = () => {
    dispatch(enableAdultMode());
    setShowAdultModeConfirm(false);
    toast.success("Đã bật chế độ người lớn");
  };

  const handleAdultModeCancel = () => {
    setShowAdultModeConfirm(false);
  };

  return (
    <>
      <div className="profile__wrap d-flex">
        <div className="col-5">
          <div className="profile__avatar">
            <Avatar src={preview} userStats={isReadOnly ? viewedUserStats : userStats} size={180} />

            {!isReadOnly && ( // Ẩn input tải ảnh lên nếu isReadOnly là true
              <input
                className="input"
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
                  className="input"
                  id="fullName"
                  type="text"
                  onChange={onChangeFullName}
                  value={fullName}
                  readOnly={isReadOnly}
                />
              </div>
              <div className="group-info">
                <label>Email</label>
                <input className="input" readOnly value={user?.email || ""} />
              </div>
              <div className="group-info">
                <label htmlFor="birthday">Ngày sinh</label>
                <input
                  className="input"
                  onChange={onChangeBirthDate}
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={birthday}
                  readOnly={isReadOnly}
                />
              </div>

              {/* Adult Mode Toggle - chỉ hiển thị cho user đủ 18 tuổi và không ở chế độ readonly */}
              {!isReadOnly && userIsAdult && (
                <div className="group-info adult-mode-section">
                  <label>Chế độ hiển thị nội dung</label>
                  <div className="adult-mode-toggle">
                    <span className="mode-info">
                      Hiện tại: {isAdultModeEnabled ? "Chế độ người lớn" : "Chế độ trẻ em"}
                    </span>
                    <button
                      type="button"
                      className={`adult-mode-btn ${isAdultModeEnabled ? 'active' : ''}`}
                      onClick={handleAdultModeToggle}
                    >
                      {isAdultModeEnabled ? "Tắt chế độ người lớn" : "Bật chế độ người lớn"}
                    </button>
                  </div>
                  <small className="mode-description">
                    {isAdultModeEnabled
                      ? "Bạn có thể xem tất cả nội dung bao gồm truyện 18+"
                      : "Chỉ hiển thị nội dung phù hợp cho mọi lứa tuổi"
                    }
                  </small>
                </div>
              )}

              {!isReadOnly && (
                <button onClick={handleEdit}>
                  {loading ? <Loading /> : "Cập nhật"}
                </button>
              )}
            </form>

          </div>
        </div>
      </div>

      {/* Adult Mode Confirmation Dialog */}
      {showAdultModeConfirm && (
        <AdultModeConfirmDialog
          onConfirm={handleAdultModeConfirm}
          onCancel={handleAdultModeCancel}
        />
      )}
    </>
  );
}

export default Profile;
