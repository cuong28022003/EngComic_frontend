import React, { useState, useEffect } from "react";
import { loginSuccess } from "../../../redux/slice/auth";
import { useSelector, useDispatch } from "react-redux";
import avt from "../../../assets/img/avt.png";
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

function Profile() {
  const { isReadOnly } = useOutletContext();
  // console.log("isReadOnly: ", isReadOnly);
  const { userId } = useParams();
  const user = useSelector((state) => state.auth.login?.user);
  const [uploadedImage, setUploadedImage] = useState("");
  const [preview, setPreview] = useState(user?.image || avt);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [birthday, setBirthday] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        setLoadingUser(true);
        const response = isReadOnly
          ? await getUserById(userId, user, dispatch, loginSuccess) // Lấy thông tin user khác nếu isReadOnly
          : user; // Lấy thông tin user đang đăng nhập
        const userData = isReadOnly ? response.data : user;
        setFullName(userData?.fullName || "");
        setBirthday(
          userData?.birthday ? userData?.birthday : new Date()
        );
        console.log("birthday: ", birthday);
        setPreview(userData?.image || avt);
        setLoadingUser(false);
      } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng:", error);
        toast.error("Có lỗi xảy ra khi tải thông tin người dùng.", {
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: false,
        });
      }
    };
    loadUserInfo();
  }, [userId, isReadOnly, user]);

  const handleSubmitSaveProfile = async (data) => {
    try {
      setLoading(true);
      const response = await updateUserInfo(
        user,
        dispatch,
        loginSuccess,
        data
      );

      dispatch(loginSuccess(response.data.data.userInfo));

      setLoading(false);
      toast.success("Cập nhật thông tin thành công", {
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: false,
      });

    } catch (error) {
      console.log(error);
      toast.error("Lỗi cập nhật thông tin", {
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: false,
      });
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      let imageUrl = preview; // Sử dụng ảnh cũ nếu không thay đổi

      if (uploadedImage) {
        const storageRef = ref(storage, `/images/${user?.username}`);
        const result = await uploadBytes(storageRef, uploadedImage);
        imageUrl = await getDownloadURL(result.ref); // Lấy URL mới nếu có upload
      }

      const data = {
        fullName: fullName,
        image: imageUrl,
        birthday: birthday,
      };

      await handleSubmitSaveProfile(data);
    } catch (error) {
      console.error("Lỗi khi upload ảnh hoặc cập nhật thông tin:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin.", {
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: false,
      });
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
      {loadingUser ? (
        <LoadingData />
      ) : (
        <div className="profile__wrap d-flex">
          <div className="col-5 profile__avt">
            <img src={preview} alt="" />
            {!isReadOnly && ( // Ẩn input tải ảnh lên nếu isReadOnly là true
              <input
                type="file"
                accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                name="avatar"
                onChange={onChangeImage}
              />
            )}
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
      )}
    </>
  );
}

export default Profile;
