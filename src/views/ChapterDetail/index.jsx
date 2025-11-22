import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../redux/slice/auth';
import { ChapterTab } from '../ComicDetail/tab/ChapterTab';
import LoadingData from '../../components/LoadingData';
import { routeLink } from '../../routes/AppRoutes';
import { getChapterById, getChaptersByComicId, getChapterByComicIdAndChapterNumber } from '../../api/chapterApi';
import { setReading } from '../../api/readingApi';
import { getDecksByUserId } from '../../api/deckApi';
import { createCard } from '../../api/cardApi';
import './Chapter.scss';
import DeckFormModal from '../Deck/component/AddEditDeck/index';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal/index';
import html2canvas from 'html2canvas';
import Chapter from '../../components/Chapter';
import { incrementViews } from '../../api/comicApi';
import { translateText, ocr } from '../../api/translatorApi';

function ChapterDetail(props) {
    const userStats = useSelector((state) => state.userStats.data);
    const { comicId, chapterNumber } = useParams();
    const [chapter, setChapter] = useState({});
    const [manual, setManual] = useState(''); // '' | 'list-chap' | 'add-card' | 'screenshot'
    console.log("manual: ", manual);
    const [loading, setLoading] = useState(true);
    const [totalChapters, setTotalChapters] = useState(0);
    const [ocrResult, setOcrResult] = useState({
        text: '',
        pronunciation: '',
        translation: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [decks, setDecks] = useState([]);
    const [loadingDecks, setLoadingDecks] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [start, setStart] = useState(null);
    const [box, setBox] = useState(null);
    const chapterContentRef = useRef(null);

    const [chapters, setChapters] = useState([]);
    const [page, setPage] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(true);
    const size = 2;



    const user = useSelector((state) => state.auth.login?.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchDecks = async () => {
        if (user) {
            setLoadingDecks(true);
            try {
                const response = await getDecksByUserId(user.id, user, dispatch, loginSuccess);
                setDecks(response.data.content || []);
                console.log('Decks fetched:', response.data.content);
            } catch (error) {
                console.error('Error fetching decks:', error);
                alert('Không thể tải danh sách bộ thẻ. Vui lòng thử lại.');
            } finally {
                setLoadingDecks(false);
            }
        }
    };

    const fetchChapterList = async () => {
        try {
            const params = {
                page: page,
                size: size,
            };
            const res = await getChaptersByComicId(comicId, params);
            // console.log("res: ", res);  
            if (res.data.content) {
                const newChapters = res.data.content;
                setChapters(prev => [...prev, ...newChapters]);
                setHasNextPage(!res.data.last); // dùng `last` từ Page<Chapter>
                setPage(prev => prev + 1);
                setTotalChapters(res.data.totalElements || 0);
            }
        } catch (error) {
            console.error("Failed to fetch chapters: ", error);
        }
    }

    const speak = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 0.7;
        window.speechSynthesis.speak(speech);
    };


    useEffect(() => {
        fetchDecks();
        fetchChapterList();
    }, [user, dispatch]);

    const handleAddCard = async () => {
        try {
            const selectedDeck = document.getElementById('deckSelect').value;
            if (!selectedDeck) {
                toast.warning('Vui lòng chọn một bộ thẻ trước khi thêm!');
                return;
            }

            const cardData = {
                front: ocrResult.translation || '',
                back: ocrResult.text || '',
                ipa: ocrResult.pronunciation || '',
                deckId: selectedDeck,
                tags: ['ocr'],
            };

            await createCard(
                cardData,
                user,
                dispatch,
                loginSuccess
            );
            toast.success('Thêm thẻ thành công!');
            document.getElementById('deckSelect').value = ''; // Reset dropdown
            setOcrResult({ text: '', pronunciation: '', translation: '' });
            setManual(''); // Reset manual mode
        } catch (error) {
            console.error('Lỗi khi tạo thẻ:', error);
            toast.error('Có lỗi xảy ra khi thêm thẻ. Vui lòng thử lại.');
        }
    }

    const handleMouseDown = (e) => {
        if (manual != 'screenshot') return;
        e.preventDefault();
        setStart({ x: e.clientX, y: e.clientY });
        setManual('screenshot');
        setBox(null);
    };

    const handleMouseMove = (e) => {
        if (manual != 'screenshot' || !start) return;
        e.preventDefault();
        const x1 = Math.min(start.x, e.clientX);
        const y1 = Math.min(start.y, e.clientY);
        const x2 = Math.max(start.x, e.clientX);
        const y2 = Math.max(start.y, e.clientY);

        setBox({
            left: x1,
            top: y1,
            width: x2 - x1,
            height: y2 - y1,
        });
    };

    const handleMouseUp = async () => {
        setManual('add-card'); // Reset manual mode
        if (!box) return;
        setIsProcessing(true);
        try {
            const rootEl = document.getElementById('root');
            const contentRect = chapterContentRef.current.getBoundingClientRect();
            console.log('Content Rect:', contentRect);
            console.log('Box:', box);

            const canvas = await html2canvas(chapterContentRef.current, {
                x: box.left + window.scrollX,
                y: box.top + window.scrollY,
                width: box.width,
                height: box.height,
                scrollX: window.scrollX,
                scrollY: window.scrollY,
                windowWidth: document.documentElement.scrollWidth,
                windowHeight: document.documentElement.scrollHeight,
                useCORS: true,
            });

            const dataUrl = canvas.toDataURL('image/png');
            // const link = document.createElement('a');
            // link.href = dataUrl;
            // link.download = `screenshot-${Date.now()}.png`;
            // link.click();

            if (!dataUrl) throw new Error('Không có nội dung trong vùng chọn.');

            const blob = await fetch(dataUrl).then((res) => res.blob());
            const formData = new FormData();
            formData.append('image', blob, 'screenshot.png');

            const result = await ocr(formData, user, dispatch, loginSuccess);
            if (result.data) {
                setOcrResult({
                    text: result.data.text || 'Không thể nhận dạng văn bản',
                    pronunciation: result.data.ipa || '',
                    translation: result.data.meaning || '',
                });
            } else {
                throw new Error('Lỗi không xác định từ API');
            }
        } catch (error) {
            console.error('Full error details:', error);
            setOcrResult({
                text: `Lỗi: ${error.message}`,
                pronunciation: '',
                translation: '',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        const fetchChapter = async () => {
            setLoading(true);
            try {
                const params = {
                    comicId: comicId,
                    chapterNumber: chapterNumber,
                }
                const response = await getChapterByComicIdAndChapterNumber(params);
                setChapter(response.data);
            } catch (error) {
                console.error('Error fetching chapter:', error);
            } finally {
                setLoading(false);
            }
        };

        const updateReading = async () => {
            if (user) {
                try {
                    const data = {
                        userId: user.id,
                        comicId: comicId,
                        chapterNumber: chapterNumber,
                    }
                    await setReading(data, user, dispatch, loginSuccess);
                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchChapter();
        updateReading();
    }, [chapterNumber, comicId, user, dispatch]);

    const handleDeckCreated = () => {
        fetchDecks();
        setIsModalOpen(false);
    };

    const handleScreenshotClick = () => {
        if (!userStats?.premium) {
            toast.warning('Chức năng này chỉ dành cho tài khoản Premium!');
            return;
        }
        setManual(manual === 'screenshot' ? '' : 'screenshot');
        setStart(null);     // reset điểm bắt đầu
        setBox(null);       // reset box chọn cũ
        setOcrResult({ text: '', pronunciation: '', translation: '' });
    }

    const handleTranslate = async () => {
        if (!ocrResult.text.trim()) {
            toast.warning('Vui lòng nhập văn bản để dịch!');
            return;
        }
        setIsProcessing(true);
        try {
            const response = await translateText({ text: ocrResult.text }, user, dispatch, loginSuccess);
            const result = response.data;
            console.log('Translation result:', result);
            setOcrResult(prev => ({
                ...prev,
                pronunciation: result?.ipa || '',
                translation: result?.meaning || '',
            }));
        } catch (error) {
            console.error('Error translating text:', error);
            toast.error('Không thể dịch văn bản!');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <LoadingData />;

    return (
        <div className="chapter-reader"
            ref={chapterContentRef}
        >
            {manual === 'screenshot' && (
                <div
                    className="snip-overlay"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    {box && (
                        <div
                            className="selection-box"
                            style={{
                                left: box.left,
                                top: box.top,
                                width: box.width,
                                height: box.height,
                            }}
                        />
                    )}
                </div>
            )}

            <div className="chapter-container">

                <ul className="chapter-manual fs-24">
                    <li
                        className={`chapter-manual__item ${manual === 'list-chap' ? 'active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setManual((prev) => (prev === 'list-chap' ? '' : 'list-chap'));
                        }}
                    >
                        <a>
                            <i className="fa-solid fa-bars"></i>
                        </a>
                        <div
                            className="chapter-manual__popup"
                            onClick={e => e.stopPropagation()} // Ngăn đóng khi click vào popup
                        >
                            <div className="list-chapter">
                                {chapters.map((chap, index) => (
                                    <Chapter
                                        key={index}
                                        chapter={chap}
                                        isActive={chapterNumber == chap.chapterNumber}
                                    />
                                ))}

                                {hasNextPage && (
                                    <button onClick={fetchChapterList} className="load-more-btn">
                                        Tải thêm chương
                                    </button>
                                )}
                            </div>
                        </div>
                    </li>
                    {chapterNumber > 1 && (
                        <li className="chapter-manual__item">
                            <Link
                                to={routeLink.chapterDetail
                                    .replace(':comicId', comicId)
                                    .replace(':chapterNumber', Number(chapterNumber) - 1)}
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                            </Link>
                        </li>
                    )}
                    {chapterNumber < totalChapters && (
                        <li className="chapter-manual__item">
                            <Link
                                to={routeLink.chapterDetail
                                    .replace(':comicId', comicId)
                                    .replace(':chapterNumber', Number(chapterNumber) + 1)}
                            >
                                <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </li>
                    )}

                    <li
                        className={`chapter-manual__item ${manual === 'screenshot' ? 'active' : ''}`}
                        onClick={() => {
                            handleScreenshotClick();
                        }}
                    >
                        <a>
                            <i className="fa-solid fa-camera"></i>
                            <span className="premium-badge">
                                <i className="fa-solid fa-crown" title="Tính năng Premium"></i>
                            </span>
                        </a>
                    </li>

                    <li
                        className={`chapter-manual__item ${manual === 'add-card' ? 'active' : ''}`}
                        onClick={() => {
                            setManual(manual === 'add-card' ? '' : 'add-card');
                            setOcrResult({ text: '', pronunciation: '', translation: '' });
                        }}
                    >
                        <a>
                            <i className="fa-solid fa-plus"></i>
                        </a>
                        {manual === 'add-card' && (
                            <div
                                className="chapter-manual__popup"
                                onClick={e => e.stopPropagation()} // Ngăn đóng khi click vào popup
                            >
                                <div className="ocr-result-panel">
                                    <div className="ocr-result-panel-header">
                                        <h3>{'Thêm thẻ mới'}</h3>
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
                                                    <label className='input-label'>Văn bản:</label>
                                                    <textarea
                                                        className="textarea"
                                                        value={ocrResult.text}
                                                        onChange={e =>
                                                            setOcrResult(prev => ({ ...prev, text: e.target.value }))
                                                        }
                                                        rows={2}
                                                    />

                                                    <button
                                                        className="button-secondary"
                                                        style={{ marginTop: 8 }}
                                                        onClick={handleTranslate}
                                                        disabled={isProcessing || !ocrResult.text.trim()}
                                                    >
                                                        Dịch
                                                    </button>

                                                    {ocrResult.text.trim() && (
                                                        <button
                                                            type="button"
                                                            className="speaker-btn"
                                                            style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}
                                                            onClick={() => { speak(ocrResult.text) }}
                                                            title="Đọc văn bản"
                                                        >
                                                            <i className="fa-solid fa-volume-high"></i>
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="ocr-section">
                                                    <label className='input-label'>Phiên âm:</label>
                                                    <textarea
                                                        className="textarea"
                                                        value={ocrResult.pronunciation}
                                                        onChange={e =>
                                                            setOcrResult(prev => ({ ...prev, pronunciation: e.target.value }))
                                                        }
                                                        rows={2}
                                                    />
                                                </div>

                                                <div className="ocr-section">
                                                    <label className='input-label'>Bản dịch:</label>
                                                    <textarea
                                                        className="textarea"
                                                        value={ocrResult.translation}
                                                        onChange={e =>
                                                            setOcrResult(prev => ({ ...prev, translation: e.target.value }))
                                                        }
                                                        rows={2}
                                                    />
                                                </div>

                                                <div className="create-card-section">
                                                    <h4>Tạo thẻ học</h4>
                                                    <div className="form-group">
                                                        <label>Chọn bộ thẻ (Deck)</label>
                                                        <div className="deck-selection">
                                                            <select className="select" id="deckSelect">
                                                                <option value="">-- Chọn bộ thẻ --</option>
                                                                {loadingDecks ? (
                                                                    <option disabled>Đang tải bộ thẻ...</option>
                                                                ) : decks.length > 0 ? (
                                                                    decks.map((deck) => (
                                                                        <option key={deck.id} value={deck.id}>
                                                                            {deck.name}
                                                                        </option>
                                                                    ))
                                                                ) : (
                                                                    <option disabled>Không có bộ thẻ nào</option>
                                                                )}
                                                            </select>
                                                            <button
                                                                className="button-secondary"
                                                                onClick={() => setIsModalOpen(true)}
                                                            >
                                                                Thêm Deck
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="button-group">
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={handleAddCard}
                                                        >
                                                            Thêm thẻ
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary"
                                                            onClick={() => {
                                                                setOcrResult({
                                                                    text: '',
                                                                    pronunciation: '',
                                                                    translation: '',
                                                                })
                                                                setManual('');
                                                            }}
                                                        >
                                                            Hủy bỏ
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>
                    <li className="chapter-manual__item">
                        <Link to={routeLink.comicDetail.replace(':comicId', comicId)}>
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        </Link>
                    </li>
                </ul>

                <div className={`chapter-content ${manual != 'list-chap' && manual != 'add-card' ? 'center-content' : ''}`}>
                    <h1 className="chapter-name">{`Chapter ${chapter?.chapterNumber}: ${chapter?.name}`}</h1>
                    <div className="image-list">
                        {(chapter?.pageUrls || []).map((page, idx) => {
                            // page là object dạng { [pageNumber]: url }
                            const pageNumber = Object.keys(page)[0];
                            const imageUrl = page[pageNumber];
                            return (
                                <img
                                    key={idx}
                                    src={imageUrl}
                                    alt={`Page ${pageNumber}`}
                                    className="chapter-image"
                                />
                            );
                        })}
                    </div>
                </div>




                {isModalOpen && (
                    <DeckFormModal
                        onDeckCreated={handleDeckCreated}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}

                {manual === 'screenshot' && (
                    <div className="screenshot-instruction">Kéo chuột để chọn vùng cần chụp</div>
                )}
            </div>
        </div>
    );
}

export default ChapterDetail;