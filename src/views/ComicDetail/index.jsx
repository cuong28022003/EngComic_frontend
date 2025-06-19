import { useCallback, useEffect, useState } from "react";
import Layout from "../../layout/MainLayout/index.jsx";
import "./styles.scss";
import { useParams, Link, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading.js";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/auth.js";
import { getComicById, getDetailComic, incrementViews } from "../../api/comicApi.js";
import { checkSavedComic } from "../../api/savedApi.js";
import { getReadingByUserIdAndComicId } from "../../api/readingApi.js";
import { ChapterTab } from "./tab/ChapterTab/index.jsx";
import { routeLink } from "../../routes/AppRoutes.js";
import RatingTab from "./tab/RatingTab/index.jsx";
import { saveComic, deleteSavedById } from "../../api/savedApi.js";
import ReportModal from "./tab/ReportModal/index.jsx";
import Button from "../../components/Button/index.jsx";

const nav = [
  //navigate
  {
    path: "about",
    display: "Giới thiệu",
  },
  {
    path: "rate",
    display: "Đánh giá",
  },
  {
    path: "chapter",
    display: "Ds Chương",
  },
  // {
  //   path: "donate",
  //   display: "Hâm mộ",
  // },
];

function ComicDetail() {
  const user = useSelector((state) => state.auth.login.user);
  const dispatch = useDispatch();
  const { comicId } = useParams();
  const [comic, setComic] = useState(null);
  const [main, setMain] = useState(null);
  const [tab, setTab] = useState("");
  const active = nav.findIndex((e) => e.path === tab);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saved, setSaved] = useState(null);
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false);

  const handleOpenReport = () => {
    if (!user) {
      toast.warning("Bạn cần đăng nhập để báo cáo");
      return;
    }
    setShowReportModal(true);
  };

  const getComic = async () => {
    try {
      const res = await getComicById(comicId);
      setComic(res.data);
      setTab("about"); //set tab mặc định là About
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const checkSaved = async () => {
    try {
      const params = {
        userId: user?.id,
        comicId: comic?.id,
      }
      const res = await checkSavedComic(
        params,
        user,
        dispatch,
        loginSuccess
      );
      setSaved(res.data || null);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user && comic) {
      checkSaved();
    }
  }, [user, comic]);

  useEffect(() => {
    getComic();
  }, [comicId]);


  useEffect(() => {
    //xử lý đổi tab
    switch (tab) {
      case "about":
        setMain(<About key={"about"} comic={comic} />);
        break;
      case "rate":
        setMain(<RatingTab key={"rate"} comicId={comic.id} />);
        break;
      case "chapter":
        setMain(<ChapterTab key={"chapter"} comicId={comic.id} />);
        break;
      default:
        setMain(<Donate key={"donate"} />);
    }
  }, [tab]);

  const onClickTab = async (e) => {
    setTab(e.target.name);
  };

  const handleSaveComic = async () => {
    try {
      const payload = { userId: user?.id, comicId: comic?.id };
      if (user) {
        const response = await saveComic(
          payload,
          user,
          dispatch,
          loginSuccess
        );
        await checkSaved(); // Cập nhật trạng thái saved sau khi lưu
        toast.success("Đánh dấu truyện thành công");
      } else {
        toast.warning("Bạn cần đăng nhập trước");
      }
    } catch (error) {
      console.error("Error saving comic:", error);
      toast.error("Đánh dấu truyện thất bại");
    }
  };

  const handleUnsaveComic = async () => {
    try {
      const response = await deleteSavedById(
        saved?.id,
        user,
        dispatch,
        loginSuccess
      );
      await checkSaved(); // Cập nhật trạng thái saved sau khi bỏ lưu
      toast.success("Bỏ đánh dấu truyện thành công");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Bỏ đánh dấu truyện thất bại");
    }
  };

  const onClickArtist = async (artist) => {
    navigate(`/search?artist=${artist}`);
  };

  const onClickGenre = async (genre) => {
    navigate(`/search?genre=${genre}`);
  };

  const onClickEnglishLevel = async (englishLevel) => {
    navigate(`/search?level=${englishLevel}`);
  };


  const onClickReading = async () => {
    try {
      if (!user) {
        navigate(routeLink.chapterDetail.replace(":comicId", comicId).replace(":chapterNumber", 1));
      } else {
        const params = {
          comicId: comicId,
          userId: user.id,
        };
        const response = await getReadingByUserIdAndComicId(
          params,
          user,
          dispatch,
          loginSuccess
        );
        console.log("reading ", response);
        const reading = response.data
        navigate(routeLink.chapterDetail.replace(":comicId", comicId).replace(":chapterNumber", reading.chapterNumber));
      }
    } catch (error) {
      console.log("Error: " + error);
    }

    // try {
    //   await incrementViews(url);
    // } catch (error) {
    //   console.error("Error incrementing views:", error);
    // }
  };

  //style
  const liClass = "border-primary rounded-2 color-primary";
  return (
    <div className="comic-detail-page">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div
            className="comic-hero"
            style={{
              backgroundImage: `url(${comic?.backgroundUrl || comic?.imageUrl})`,
            }}
          >
            <div className="comic-hero__overlay">
              <div className="comic-hero__content container">
                <div className="comic-hero__left">
                  <img src={comic?.imageUrl} alt={comic?.name} className="comic-poster" />
                </div>
                <div className="comic-hero__right">
                  <h1 className="comic-title">{comic?.name}</h1>
                  <ul className="comic-meta">
                    <li onClick={() => onClickArtist(comic?.artist)}>{comic?.artist}</li>
                      <li onClick={() => onClickGenre(comic?.genre)}>{comic?.genre}</li>
                      <li onClick={() => onClickEnglishLevel(comic?.englishLevel)}>{comic?.englishLevel}</li>
                  </ul>
                  <ul className="comic-stats">
                    <li><strong>{comic?.totalChapters || 0}</strong> Chương</li>
                    <li><strong>{comic?.views || 0}</strong> Lượt đọc</li>
                  </ul>
                  <div className="comic-rating-summary">
                    <StarRatingDisplay rating={comic?.rating} />
                    <span className="score">({comic?.rating?.toFixed(1)} / 5)</span>
                    <span className="total">- {comic?.totalRatings} đánh giá</span>
                  </div>
                  <div className="comic-actions">
                    <button className="button-primary" onClick={onClickReading}>Đọc truyện</button>
                    <button className={`button-outline ${saved ? "saved" : ""}`} onClick={saved ? handleUnsaveComic : handleSaveComic}>
                      {saved ? "Đã đánh dấu" : "Đánh dấu"}
                    </button>
                    <button className="button-outline" onClick={handleOpenReport}>Báo cáo</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="story-detail">
            <div className="navigate">
              {nav.map((item, index) => (
                <a
                  className={`navigate__tab fs-20 bold ${active === index ? "tab_active" : ""}`}
                  key={index}
                  name={item.path}
                  onClick={onClickTab}
                >
                  {item.display}
                </a>
              ))}
            </div>
            <div className="story-detail__tab__main">{main}</div>
          </div>
        </>
      )}
      {showReportModal && (
        <ReportModal
          comicId={comic?.id}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
  
}

const About = (props) => {
  return (
    <>
      <p>{props.comic?.description}</p>
    </>
  );
};

const StarRatingDisplay = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) stars.push(<span key={i} className="filled">★</span>);
    else if (i === fullStars + 1 && halfStar) stars.push(<span key={i} className="half">★</span>);
    else stars.push(<span key={i}>☆</span>);
  }

  return <div className="star-rating-display">{stars}</div>;
};

const Donate = (props) => {
  return <h1>Hâm mộ</h1>;
};
export default ComicDetail;
