import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import apiMain from '../../api/apiMain';
import getData from '../../api/getData';
import { Link } from 'react-router-dom';
import { loginSuccess } from '../../redux/authSlice';
import "./Chapter.scss";
import { ListChapter } from '../StoryDetail/StoryDetail';

function Chapter(props) {
    const { chapnum, url } = useParams();
    const [chapter, setChapter] = useState({});
    const [fontsize, setFontsize] = useState(18);
    const [lineHeight, setLineHeight] = useState(1.5);
    const [manual, setManual] = useState("");
    const user = useSelector(state => state.auth.login?.user);
    const dispatch = useDispatch();

    useEffect(() => { // Xử lý load dữ liệu chương truyện
        const getChapter = async () => { // Tạo hàm
            try {
                const response = await apiMain.getChapterByNumber(url, chapnum, user, dispatch, loginSuccess);
                setChapter(getData(response));
            } catch (error) {
                console.error("Error fetching chapter data:", error);
            }
        };
        getChapter(); // Gọi hàm
    }, [chapnum, url]);

    useEffect(() => { // Xử lý sự kiện click khi đọc truyện
        const handleClick = () => { // Khi click sẽ set manual về "" để ẩn manual
            setManual("");
        };
        document.addEventListener("click", handleClick);
        return () => { document.removeEventListener("click", handleClick); };
    }, []);

    return (
        <>
            <div className="main" style={{ backgroundColor: "#ced9d9", paddingTop: "30px" }}>
                <div className="container">
                    <div className="main-content" style={{ position: "relative", margin: "0 80px", backgroundColor: "#e1e8e8" }}>
                        <ul className="chapter-manual fs-24">
                            <li className={`chapter-manual__item ${manual === 'list-chap' ? 'active' : ''}`} onClick={(e) => {
                                e.stopPropagation();
                                if (manual === 'list-chap')
                                    setChapter("");
                                else
                                    setManual("list-chap");
                            }}>
                                <a><i className="fa-solid fa-bars"></i></a>
                                <div className="chapter-manual__popup">
                                    <div className="list-chapter" style={{ width: "700px", maxHeight: "500px", overflow: "scroll" }}>
                                        <ListChapter url={url} col={2} fontsize={15} />
                                    </div>
                                </div>
                            </li>
                            <li className={`chapter-manual__item ${manual === 'setting' ? 'active' : ''}`} onClick={(e) => {
                                e.stopPropagation();
                                if (manual === "setting")
                                    setManual("");
                                else
                                    setManual("setting");
                            }}>
                                <a><i className="fa-solid fa-gear"></i></a>
                                <div className="chapter-manual__popup">
                                    <h4>Cài đặt</h4>
                                    <div className="chapter-setting">
                                        <table className="chapter-setting__body fs-18">
                                            <tbody>
                                                <tr>
                                                    <td className="col-4">
                                                        <div className="chapter-setting__label">
                                                            <i className="fa-solid fa-font"></i>
                                                            Cỡ chữ
                                                        </div>
                                                    </td>
                                                    <td className="col-8">
                                                        <div className="d-flex chapter-setting__input">
                                                            <button onClick={() => { setFontsize(pre => pre - 1); }}><i className="fa-solid fa-minus"></i></button>
                                                            <div>{`${fontsize}px`}</div>
                                                            <button onClick={() => { setFontsize(pre => pre + 1); }}><i className="fa-solid fa-plus"></i></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="col-4">
                                                        <div className="chapter-setting__label">
                                                            <i className="fa-solid fa-font"></i>
                                                            Giãn dòng
                                                        </div>
                                                    </td>
                                                    <td className="col-8">
                                                        <div className="d-flex chapter-setting__input">
                                                            <button onClick={() => { setLineHeight(pre => Number((pre - 0.1).toFixed(1))); }}><i className="fa-solid fa-minus"></i></button>
                                                            <div>{`${lineHeight}`}</div>
                                                            <button onClick={() => { setLineHeight(pre => Number((pre + 0.1).toFixed(1))); }}><i className="fa-solid fa-plus"></i></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </li>
                            <li className="chapter-manual__item"><Link to={`/truyen/${url}`}><i className="fa-solid fa-arrow-left"></i></Link></li>
                            <li className="chapter-manual__item"><a><i className="fa-solid fa-comments"></i></a></li>
                        </ul>
                        <div className="d-lex">
                            <h1 className="chapter-name">{chapter?.tenchap}</h1>
                            <div className="image-list">
                                {chapter?.danhSachAnh?.map((imageUrl, index) => (
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

export default Chapter;
