import { useCallback, useEffect, useState } from "react";
import Layout from "../../layout/MainLayout";
import "./_StoryDetail.scss";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiMain from "../../api/apiMain";
import Loading from "../../components/Loading/Loading";
import LoadingData from "../../components/Loading/LoadingData";
import Grid from "../../components/Grid";
import Rate from "../../components/Rate";
import Comment from "../../components/Comment";
import Pagination from "../../components/Pagination/index";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/auth";
import { getDetailComic, getChapters } from "../../api/comicApi";
import { checkSavedComic } from "../../api/savedApi";
import { getReading } from "../../api/readingApi";

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
  {
    path: "comment",
    display: "Bình luận",
  },
  {
    path: "donate",
    display: "Hâm mộ",
  },
];

function ComicDetail() {
  const user = useSelector((state) => state.auth.login.user);
  const dispatch = useDispatch();
  const { url } = useParams();
  const [comic, setComic] = useState(null);
  const [main, setMain] = useState(null);
  const [tab, setTab] = useState("");
  const active = nav.findIndex((e) => e.path === tab);
  const [loadingData, setLoadingData] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    const getComic = async () => {
      try {
        const res = await getDetailComic(url);
        setComic(res.data);
        setTab("about"); //set tab mặc định là About
        setLoadingData(false);
      } catch (error) {
        console.log(error);
      }
    };
    getComic();

    const checkSaved = async () => {
      try {
        const res = await checkSavedComic(
          url,
          user,
          dispatch,
          loginSuccess
        );
        console.log(res);
        setIsSaved(res.saved);
      } catch (error) {
        console.log(error);
      }
    };
    checkSaved();
  }, [url]);

  useEffect(() => {
    //xử lý đổi tab
    switch (tab) {
      case "about":
        setMain(<About key={"about"} comic={comic} />);
        break;
      case "rate":
        setMain(<Rate key={"rate"} url={comic.url} />);
        break;
      case "chapter":
        setMain(<ListChapter key={"chapter"} url={comic.url} />);
        break;
      case "comment":
        setMain(<Comment key={"comment"} url={comic.url} />);
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
      const payload = { url: comic?.url };
      if (user) {
        const response = await apiMain.saveComic(
          payload,
          user,
          dispatch,
          loginSuccess
        );
        setIsSaved(true);
        console.log(response);
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
      const payload = { url: comic?.url };
      const response = await apiMain.unsaveComic(
        payload,
        user,
        dispatch,
        loginSuccess
      );
      setIsSaved(false);
      console.log(response);
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

  const onClickReading = async () => {
    try {
      if (!user) {
        navigate(`/comics/${url}/chapters/1`);
      } else {
        const response = await getReading(
          url,
          user,
          dispatch,
          loginSuccess
        );
        console.log(response);
        const reading = response
        navigate(`/comics/${url}/${reading.chapterNumber}`);
      }
    } catch (error) {
      console.log("Error: " + error);
    }

    try {
      await apiMain.incrementViews(url);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  //style
  const liClass = "border-primary rounded-2 color-primary";
  return (
    <Layout>
      <div className="main-content">
        {loadingData ? (
          <LoadingData />
        ) : (
          <>
            <div className="heroSide d-flex">
              <div className="img-wrap">
                <img src={comic?.image} alt="" />
              </div>
              <div className="heroSide__main">
                <h2 className="mb-1">{comic?.name}</h2>
                <ul className="">
                  <li
                    className={liClass}
                    onClick={() => onClickArtist(comic?.artist)}
                    style={{ cursor: "pointer" }}
                  >
                    {comic?.artist}
                  </li>
                  {/* <li className={liClass}>{comic?.status}</li> */}
                  <li
                    className={liClass}
                    onClick={() => onClickGenre(comic?.genre)}
                    style={{ cursor: "pointer" }}
                  >
                    {comic?.genre}
                  </li>
                </ul>
                <ul className="heroSide__info">
                  <li>
                    <span className="fs-16 bold">
                      {comic?.chapterCount || "0"}
                    </span>
                    <br />
                    <span>Chương</span>
                  </li>
                  <li>
                    <span className="fs-16 bold">{comic?.views || "0"}</span>
                    <br />
                    <span>Lượt đọc</span>
                  </li>

                  <li>
                    <span className="fs-16 bold">{100 || "0"}</span>
                    <br />
                    <span>Cất giữ</span>
                  </li>
                </ul>

                <div className="heroSide__rate">
                  <span
                    className={`fa fa-star ${comic?.rating >= 1 ? "checked" : ""
                      }`}
                  ></span>
                  <span
                    className={`fa fa-star ${comic?.rating >= 2 ? "checked" : ""
                      }`}
                  ></span>
                  <span
                    className={`fa fa-star ${comic?.rating >= 3 ? "checked" : ""
                      }`}
                  ></span>
                  <span
                    className={`fa fa-star ${comic?.rating >= 4 ? "checked" : ""
                      }`}
                  ></span>
                  <span
                    className={`fa fa-star ${comic?.rating >= 5 ? "checked" : ""
                      }`}
                  ></span>
                  <span>
                    &nbsp;{comic?.rating}/5 ({comic?.ratingCount} đánh giá)
                  </span>
                </div>
                <div className="">
                  <button className="btn-primary mr-1" onClick={onClickReading}>
                    Đọc truyện
                  </button>
                  <button
                    className={`btn-outline mr-1 ${isSaved ? "saved" : ""}`}
                    onClick={isSaved ? handleUnsaveComic : handleSaveComic}
                  >
                    {isSaved ? "Đã đánh dấu" : "Đánh dấu"}
                  </button>
                  <button className="btn-outline">Đề cử</button>
                </div>
              </div>
            </div>

            <div className="story-detail">
              <div className="navigate">
                {nav.map((item, index) => {
                  return (
                    <a
                      className={`navigate__tab fs-20 bold ${active === index ? "tab_active" : ""
                        }`}
                      key={index}
                      name={item.path}
                      onClick={onClickTab}
                    >
                      {item.display}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="story-detail__tab__main">{main}</div>
          </>
        )}
      </div>
    </Layout>
  );
}

const About = (props) => {
  return (
    <>
      <p>{props.comic?.description}</p>
    </>
  );
};

export const ListChapter = (props) => {
  const [chapters, setChapters] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const url = props.url;
  useEffect(() => {
    const loadList = async () => {
      const params = {
        page: currentPage,
        size: 20,
      };

      getChapters(props.url, params).then((res) => {
        console.log("chapters" + res.content);
        setChapters(res?.content || []);
        setTotalPages(res.totalPages);
        setLoadingData(false);
      });
    };
    loadList(); //gọi hàm
  }, [props.url, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  return (
    <>
      <h3>Danh sách chương</h3>
      {loadingData ? (
        <LoadingData />
      ) : (
        <Grid gap={15} col={props.col || 3} snCol={1}>
          {chapters.map((item, index) => {
            return (
              <Link
                to={`comics/${url}/${item.chapterNumber}`}
                key={index}
                className="text-overflow-1-lines"
                style={{ fontSize: `${props.fontsize || 16}px` }}
              >
                {item.name}
              </Link>
            );
          })}
        </Grid>
      )}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </>
  );
};

const Donate = (props) => {
  return <h1>Hâm mộ</h1>;
};
export default ComicDetail;
