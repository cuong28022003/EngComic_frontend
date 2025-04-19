import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { loginSuccess } from '../../redux/slice/auth';
import { ChapterTab } from '../ComicDetail/tab/ChapterTab';
import LoadingData from '../../components/Loading/LoadingData';
import { routeLink } from '../../routes/AppRoutes';
import { getChapter } from '../../api/chapterApi';
import { setReading } from '../../api/readingApi';
import "./Chapter.scss";
import domtoimage from 'dom-to-image';

function ChapterDetail(props) {
    const { chapterNumber, url } = useParams();
    const [chapter, setChapter] = useState({});
    const [manual, setManual] = useState("");
    const [loading, setLoading] = useState(true);
    const [totalChapters, setTotalChapters] = useState(0);
    const [isScreenshotMode, setIsScreenshotMode] = useState(false);
    const [selection, setSelection] = useState(null);
    const [ocrResult, setOcrResult] = useState({
        text: "",
        pronunciation: "",
        translation: "",
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const chapterContentRef = useRef(null);
    const user = useSelector(state => state.auth.login?.user);
    const dispatch = useDispatch();

    const toggleScreenshotMode = (e) => {
        e.stopPropagation();
        setIsScreenshotMode(!isScreenshotMode);
        setSelection(null);
        if (!isScreenshotMode) {
            setOcrResult({
                text: "",
                pronunciation: "",
                translation: "",
            });
        }
    };

    const handleMouseDown = (e) => {
        if (!isScreenshotMode) return;
        e.preventDefault();
        const rect = chapterContentRef.current.getBoundingClientRect();
        setSelection({
            startX: e.clientX - rect.left,
            startY: e.clientY - rect.top,
            endX: e.clientX - rect.left,
            endY: e.clientY - rect.top
        });
    };

    const handleMouseMove = (e) => {
        if (!isScreenshotMode || !selection) return;
        e.preventDefault();
        const rect = chapterContentRef.current.getBoundingClientRect();
        setSelection(prev => ({
            ...prev,
            endX: e.clientX - rect.left,
            endY: e.clientY - rect.top
        }));
    };

    const handleMouseUp = async () => {
        if (!isScreenshotMode || !selection) return;
        const width = Math.abs(selection.endX - selection.startX);
        const height = Math.abs(selection.endY - selection.startY);
        if (width < 10 || height < 10) {
            setSelection(null);
            setIsScreenshotMode(false);
            return;
        }

        setIsProcessing(true);
        setIsScreenshotMode(false);
        setSelection(null);
        try {
            const left = Math.min(selection.startX, selection.endX);
            const top = Math.min(selection.startY, selection.endY);

            const dataUrl = await domtoimage.toPng(chapterContentRef.current, {
                width: width,
                height: height,
                style: {
                    transform: `translate(${-left}px, ${-top}px)`,
                }
            });

            if (!dataUrl) throw new Error("Không có nội dung trong vùng chọn.");
            
            const blob = await fetch(dataUrl).then(res => res.blob());
            const formData = new FormData();
            formData.append('file', blob, 'screenshot.png');

            const response = await fetch('https://web-production-9252.up.railway.app/extract-text', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API error: ${errorText}`);
            }

            const result = await response.json();
            if (result.status === "success") {
                setOcrResult({
                    text: result.data.text || "Không thể nhận dạng văn bản",
                    pronunciation: result.data.pronunciation || "",
                    translation: result.data.translation || ""
                });
            } else {
                throw new Error(result.message || "Lỗi không xác định từ API");
            }
        } catch (error) {
            console.error("Full error details:", error);
            setOcrResult({
                text: `Lỗi: ${error.message}`,
                pronunciation: "",
                translation: ""
            });
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        const fetchChapter = async () => {
            setLoading(true);
            try {
                const response = await getChapter(url, chapterNumber);
                setChapter(response.data);
                setTotalChapters(response.data.totalChapters);
            } catch (error) {
                console.error("Error fetching chapter:", error);
            } finally {
                setLoading(false);
            }
        };

        const updateReading = async () => {
            if (user) {
                try {
                    await setReading({ url, chapterNumber }, user, dispatch, loginSuccess);
                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchChapter();
        updateReading();
    }, [chapterNumber, url, user, dispatch]);

    useEffect(() => {
        const handleClickOutside = () => setManual("");
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    if (loading) return <LoadingData />;

    return (
        <div className="chapter-reader">
            <div className="chapter-container">
                <div className={`main-content ${isScreenshotMode ? 'screenshot-mode' : ''}`}
                    ref={chapterContentRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <ul className="chapter-manual fs-24">
                        <li
                            className={`chapter-manual__item ${manual === 'list-chap' ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setManual(prev => prev === 'list-chap' ? '' : 'list-chap');
                            }}
                        >
                            <a><i className="fa-solid fa-bars"></i></a>
                            <div className="chapter-manual__popup">
                                <div className="list-chapter">
                                    <ChapterTab url={url} col={2} fontsize={15} />
                                </div>
                            </div>
                        </li>
                        {chapterNumber > 1 && (
                            <li className="chapter-manual__item">
                                <Link to={routeLink.chapterDetail.replace(":url", url).replace(":chapterNumber", Number(chapterNumber) - 1)}>
                                    <i className="fa-solid fa-arrow-left"></i>
                                </Link>
                            </li>
                        )}
                        {chapterNumber < totalChapters && (
                            <li className="chapter-manual__item">
                                <Link to={routeLink.chapterDetail.replace(":url", url).replace(":chapterNumber", Number(chapterNumber) + 1)}>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </li>
                        )}
                        <li className="chapter-manual__item">
                            <Link to={routeLink.comicDetail.replace(":url", url)}>
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                            </Link>
                        </li>
                        <li
                            className={`chapter-manual__item ${isScreenshotMode ? 'active' : ''}`}
                            onClick={toggleScreenshotMode}
                        >
                            <a><i className="fa-solid fa-camera"></i></a>
                        </li>
                    </ul>

                    {selection && (
                        <div className="selection-area"
                            style={{
                                left: Math.min(selection.startX, selection.endX),
                                top: Math.min(selection.startY, selection.endY),
                                width: Math.abs(selection.endX - selection.startX),
                                height: Math.abs(selection.endY - selection.startY),
                            }}
                        />
                    )}

                    <div className="chapter-content">
                        <h1 className="chapter-name">{chapter?.name}</h1>
                        <div className="image-list">
                            {chapter?.images?.map((imageUrl, index) => (
                                <img
                                    key={index}
                                    src={imageUrl}
                                    alt={`Page ${index + 1}`}
                                    className="chapter-image"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {(ocrResult.text || isProcessing) && (
                    <div className="ocr-result-container">
                        <div className="ocr-result-panel">
                            <div className="ocr-result-panel-header">
                                <h3>Kết quả OCR</h3>
                                <button 
                                    onClick={() => setOcrResult({ text: "", pronunciation: "", translation: "" })} 
                                    className="close-ocr-btn"
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </div>
                            <div className="ocr-result-content">
                                {isProcessing ? (
                                    <div className="ocr-loading">
                                        <div className="spinner"></div>
                                        <p>Đang xử lý ảnh...</p>
                                    </div>
                                ) : (
                                    <div className="ocr-details">
                                        <div className="ocr-section">
                                            <h4>Văn bản:</h4>
                                            <p className="ocr-text">{ocrResult.text}</p>
                                        </div>
                                        {ocrResult.pronunciation && (
                                            <div className="ocr-section">
                                                <h4>Phiên âm:</h4>
                                                <p className="ocr-pronunciation">{ocrResult.pronunciation}</p>
                                            </div>
                                        )}
                                        {ocrResult.translation && (
                                            <div className="ocr-section">
                                                <h4>Bản dịch:</h4>
                                                <p className="ocr-translation">{ocrResult.translation}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isScreenshotMode && (
                <div className="screenshot-instruction">
                    Kéo chuột để chọn vùng cần chụp
                </div>
            )}
        </div>
    );
}

export default ChapterDetail;