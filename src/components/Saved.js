import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slice/auth";
import { toast } from "react-toastify";
import { deleteSavedById } from "../api/savedApi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { routeLink } from "../routes/AppRoutes";


const Saved = ({ saved, isReadOnly }) => {
  const comic = saved?.comic;
  const user = useSelector((state) => state.auth.login.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleUnsaveComic = async () => {
    try {
      const response = await deleteSavedById(
        saved.id,
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
    navigate(routeLink.comicDetail.replace(":comicId", e.target.name)); //điều hướng web
  };

  return (
    <div className="saved-item">
      <div className="saved-item__img-wrap">
        <img src={comic.imageUrl} alt={comic.name} />
      </div>
      <div className="saved-item__content">
        <a onClick={onClickTruyen} name={comic?.id} className="reading-card__title">
          {comic.name}
        </a>
        <p className="saved-item__info">Tác giả: {comic.artist}</p>
        {!isReadOnly && (
          <button className="btn-remove" onClick={() => handleUnsaveComic()}>
            Bỏ đánh dấu
          </button>
        )}
      </div>
    </div>
  );
};

export default Saved;
