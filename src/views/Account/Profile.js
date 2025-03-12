import React, { useState, useEffect } from "react";
import apiMain from "../../api/apiMain";
import { loginSuccess } from "../../redux/slice/auth";
import { useSelector, useDispatch } from "react-redux";
import avt from "../../assets/img/avt.png";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { setLoading } from "../../redux/messageSlice";
import Loading from "../../components/Loading/Loading";
import LoadingData from "../../components/Loading/LoadingData";
import getData from "../../api/getData";

function Profile({ userInfo, changeUserInfo }) {
  const user = useSelector((state) => state.auth.login?.user);
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(userInfo?.image || avt);
  const [name, setName] = useState(userInfo?.tenhienthi || "");
  const [birthDate, setBirthDate] = useState(new Date());
  const loading = useSelector((state) => state.message.loading);
  const [loadingUser, setLoadingUser] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUserInfo = async () => {
      if (userInfo) {
        setName(userInfo?.tenhienthi);
        setBirthDate(
          userInfo?.birthdate ? new Date(userInfo?.birthdate) : new Date()
        );
        setPreview(userInfo?.image);
        setLoadingUser(false);
      }
    };
    loadUserInfo();
  }, [userInfo]);

  const handleSubmitSaveProfile = async (data) => {
    try {
      dispatch(setLoading(true));
      const response = await apiMain.updateUserInfo(
        user,
        dispatch,
        loginSuccess,
        data
      );

      // const payload = { name: response.userInfo.tenhienthi, image: response.userInfo.image };


      // console.log("Update:" + JSON.stringify(response));
      // console.log("name: " + response.userInfo.tenhienthi);
      // console.log("payload: " + payload);
      // dispatch(updateUserProfile(payload));
      // console.log("name_user: " + user.image);
      dispatch(setLoading(false));
      toast.success("Cập nhật thông tin thành công", {
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: false,
      });
      const newUser = {
        ...user,
        image: response.userInfo.image,
        name: response.userInfo.tenhienthi,
      };
      dispatch(loginSuccess(newUser));
      changeUserInfo(response.userInfo);
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
    try {
      let imageUrl = preview; // Sử dụng ảnh cũ nếu không thay đổi

      if (image) {
        const storageRef = ref(storage, `/images/${userInfo?.username}`);
        const result = await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(result.ref); // Lấy URL mới nếu có upload
      }

      const data = {
        tenhienthi: name,
        image: imageUrl,
        birthdate: birthDate,
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

  const onChangeName = (e) => setName(e.target.value);

  const onChangeBirthDate = (e) => {
    try {
      const date = new Date(e.target.value);
      const regex = new RegExp(
        "([0-9]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))"
      );
      if (regex.test(date.toISOString().substring(0, 10))) {
        setBirthDate(date);
      } else {
        setBirthDate(new Date());
      }
    } catch {
      setBirthDate(new Date());
    }
  };

  const onChangeImage = (e) => {
    if (e.target.files.length !== 0) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const labelStyle = { minWidth: "100px", display: "inline-block" };

  return (
    <>
      {loadingUser ? (
        <LoadingData />
      ) : (
        <div className="profile__wrap d-flex">
          <div className="col-5 profile__avt">
            <img src={preview} alt="" />
            <input
              type="file"
              accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
              name="avatar"
              onChange={onChangeImage}
            />
          </div>
          <div className="col-7">
            <div className="profile__main">
              <form>
                <div className="group-info">
                  <label htmlFor="" style={labelStyle}>
                    Tên hiển thị
                  </label>
                  <input onChange={onChangeName} value={name || ""} />
                </div>
                <div className="group-info">
                  <label htmlFor="" style={labelStyle}>
                    Email
                  </label>
                  <input readOnly value={userInfo?.email || ""} />
                </div>
                <div className="group-info">
                  <label htmlFor="" style={labelStyle}>
                    Ngày sinh
                  </label>
                  <input
                    onChange={onChangeBirthDate}
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={birthDate?.toISOString().substring(0, 10)}
                  />
                </div>
                <div className="d-flex">
                  <button onClick={handleEdit}>
                    {loading ? <Loading /> : ""} Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
