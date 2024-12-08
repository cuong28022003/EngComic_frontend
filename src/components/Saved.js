import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { toast } from "react-toastify";
import apiMain from "../api/apiMain";
import { Link, useLocation, useNavigate } from "react-router-dom";


const Saved = (props) => {
  const data = props.data;
  const user = useSelector((state) => state.auth.login.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const handleUnsaveComic = async () => {
    try {
      const payload = { url: data.url };
      const response = await apiMain.unsaveComic(
        payload,
        user,
        dispatch,
        loginSuccess
      );
      console.log(response);
      toast.success("Bỏ đánh dấu truyện thành công");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Bỏ đánh dấu truyện thất bại");
    }
  };

  const onClickTruyen = (e) => {
    //xử lý click vào tên truyện để đọc
    navigate("/truyen/" + e.target.name); //điều hướng web
  };

  return (
    <div className="saved-item">
      <div className="saved-item__img-wrap">
        <img src={data.image} alt={data.name} />
      </div>
      <div className="saved-item__content">
        <a onClick={onClickTruyen} name={data?.url} className="reading-card__title">
          {data.name}
        </a>
        <p className="saved-item__info">Tác giả: {data.artist}</p>
        <button className="btn-remove" onClick={() => handleUnsaveComic()}>
          Bỏ đánh dấu
        </button>
      </div>
    </div>
  );
};

export default Saved;
