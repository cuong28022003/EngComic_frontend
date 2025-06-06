import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../redux/slice/auth';
import { ChapterTab } from '../ComicDetail/tab/ChapterTab';
import LoadingData from '../../components/Loading/LoadingData';
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

            const cropX = box.left - contentRect.left;
            const cropY = box.top - contentRect.top;

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
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `screenshot-${Date.now()}.png`;
            link.click();

            if (!dataUrl) throw new Error('Không có nội dung trong vùng chọn.');

            const blob = await fetch(dataUrl).then((res) => res.blob());
            const formData = new FormData();
            formData.append('file', blob, 'screenshot.png');

            const response = await fetch('https://ocr-api-p4y3.onrender.com/extract-text', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API error: ${errorText}`);
            }

            const result = await response.json();
            if (result.status === 'success') {
                setOcrResult({
                    text: result.data.text || 'Không thể nhận dạng văn bản',
                    pronunciation: result.data.pronunciation || '',
                    translation: result.data.translation || '',
                });
            } else {
                throw new Error(result.message || 'Lỗi không xác định từ API');
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
                                                                className="btn-primary btn-sm"
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
                    <h1 className="chapter-name">{chapter?.name}</h1>
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