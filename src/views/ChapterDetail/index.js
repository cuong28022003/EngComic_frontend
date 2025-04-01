import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import apiMain from '../../api/apiMain';
import getData from '../../api/getData';
import { Link } from 'react-router-dom';
import { loginSuccess } from '../../redux/slice/auth';
import "./Chapter.scss";
import { ChapterTab } from '../ComicDetail/tab/ChapterTab';
import LoadingData from '../../components/Loading/LoadingData';
import { routeLink } from '../../routes/AppRoutes';
import { getChapter } from '../../api/chapterApi';
import { setReading } from '../../api/readingApi';
import { set } from 'lodash';

function ChapterDetail(props) {
    const { chapterNumber, url } = useParams();
    const [chapter, setChapter] = useState({});
    const [fontsize, setFontsize] = useState(18);
    const [lineHeight, setLineHeight] = useState(1.5);
    const [manual, setManual] = useState("");
    const [comic, setComic] = useState(null);
    const user = useSelector(state => state.auth.login?.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [totalChapters, setTotalChapters] = useState(0);
    // console.log("chapterNumber: " + chapterNumber);
    console.log("location.state: " + location.state);
    console.log("totalChapters: " + totalChapters);

    // useEffect(() => {
    //     const getComic = async () => {
    //         try {
    //             let params = { url };
    //             const res = await apiMain.getComic(params);
    //             console.log(res);
    //             setComic(res);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };
    //     getComic();
    // }, [url])

    useEffect(() => {
        const fetchChapter = async () => {
            try {
                setLoading(true);
                const response = await getChapter(url, chapterNumber);
                // console.log("chapter: " + response);
                setChapter(response.data);
                setTotalChapters(response.data.totalChapters);  
            } catch (error) {
                console.error("Error fetching chapter:", error);
            } finally {
                setLoading(false);
            }
        };

        const updateReading = async () => {
            try {
                if (user) {
                    let params = { url, chapterNumber };
                    const res = await setReading(params, user, dispatch, loginSuccess);
                    // console.log(res);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchChapter();
        updateReading();
    }, [chapterNumber, url]);

    useEffect(() => { // Xử lý sự kiện click khi đọc truyện
        const handleClick = () => { // Khi click sẽ set manual về "" để ẩn manual
            setManual("");
        };
        document.addEventListener("click", handleClick);
        return () => { document.removeEventListener("click", handleClick); };
    }, []);

    if (loading) {
        return <LoadingData />; // Hiển thị thông báo loading
    }

    return (
        <>
            <div className="main" style={{ backgroundColor: "#ced9d9", paddingTop: "30px" }}>
                <div className="container">
                    <div className="main-content" style={{ position: "relative", margin: "0 80px", backgroundColor: "#e1e8e8" }}>
                        <ul className="chapter-manual fs-24">
                            <li className={`chapter-manual__item ${manual === 'list-chap' ? 'active' : ''}`} onClick={(e) => {
                                e.stopPropagation();
                                setManual((prevManual) => (prevManual === 'list-chap' ? '' : 'list-chap')); // Toggle trạng thái
                            }}>
                                <a><i className="fa-solid fa-bars"></i></a>
                                <div className="chapter-manual__popup">
                                    <div className="list-chapter" style={{ width: "700px", maxHeight: "500px", overflow: "scroll" }}>
                                        <ChapterTab url={url} col={2} fontsize={15} />
                                    </div>
                                </div>
                            </li>
                            {/* Hiển thị "Chương trước" nếu không phải chương đầu tiên */}
                            {chapterNumber > 1 && (
                                <li className="chapter-manual__item">
                                    <Link to={routeLink.chapterDetail.replace(":url", url).replace(":chapterNumber", Number(chapterNumber)-1)} title="Chương trước">
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </Link>
                                </li>
                            )}
                            {/* Hiển thị "Chương sau" nếu không phải chương đầu tiên */}
                            {chapterNumber < totalChapters && (
                                <li className="chapter-manual__item">
                                    <Link to={routeLink.chapterDetail.replace(":url", url).replace(":chapterNumber", Number(chapterNumber)+1)} title="Chương sau">
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </Link>
                                </li>
                            )}
                            <li className="chapter-manual__item"><Link to={routeLink.comicDetail.replace(":url", url)} title="Thoát đọc truyện"><i className="fa-solid fa-arrow-right-from-bracket"></i></Link></li>
                        </ul>
                        <div className="d-lex">
                            <h1 className="chapter-name">{chapter?.name}</h1>
                            <div className="image-list">
                                {chapter?.images?.map((imageUrl, index) => (
                                    <img
                                        key={index}
                                        src={imageUrl}
                                        alt={`Page ${index + 1}`}
                                        className="chapter-image"
                                        style={{ fontSize: `${fontsize}px`, lineHeight }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChapterDetail;
