import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../redux/slice/auth';
import { ChapterTab } from '../ComicDetail/tab/ChapterTab';
import LoadingData from '../../components/Loading/LoadingData';
import { routeLink } from '../../routes/AppRoutes';
import { getChapter } from '../../api/chapterApi';
import { setReading } from '../../api/readingApi';
import { getDecksByUserId } from '../../api/deckApi';
import { createCard } from '../../api/cardApi';
import './Chapter.scss';
import domtoimage from 'dom-to-image';
import DeckFormPage from '../Deck/component/AddEditDeck/index';
import { toast } from 'react-toastify'; 
function ChapterDetail(props) {
    const { chapterNumber, url } = useParams();
    const [chapter, setChapter] = useState({});
    const [manual, setManual] = useState('');
    const [loading, setLoading] = useState(true);
    const [totalChapters, setTotalChapters] = useState(0);
    const [isScreenshotMode, setIsScreenshotMode] = useState(false);
    const [selection, setSelection] = useState(null);
    const [ocrResult, setOcrResult] = useState({
        text: '',
        pronunciation: '',
        translation: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [decks, setDecks] = useState([]);
    const [loadingDecks, setLoadingDecks] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const chapterContentRef = useRef(null);
    const user = useSelector((state) => state.auth.login?.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchDecks = async () => {
        if (user) {
            setLoadingDecks(true);
            try {
                const response = await getDecksByUserId(user.id, user, dispatch, loginSuccess);
                setDecks(response.data.content || []);
            } catch (error) {
                console.error('Error fetching decks:', error);
                alert('Không thể tải danh sách bộ thẻ. Vui lòng thử lại.');
            } finally {
                setLoadingDecks(false);
            }
        }
    };

    useEffect(() => {
        fetchDecks();
    }, [user, dispatch]);

    const toggleScreenshotMode = (e) => {
        e.stopPropagation();
        setIsScreenshotMode(!isScreenshotMode);
        setSelection(null);
        if (!isScreenshotMode) {
            setOcrResult({
                text: '',
                pronunciation: '',
                translation: '',
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
            endY: e.clientY - rect.top,
        });
    };

    const handleMouseMove = (e) => {
        if (!isScreenshotMode || !selection) return;
        e.preventDefault();
        const rect = chapterContentRef.current.getBoundingClientRect();
        setSelection((prev) => ({
            ...prev,
            endX: e.clientX - rect.left,
            endY: e.clientY - rect.top,
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
                },
            });

            if (!dataUrl) throw new Error('Không có nội dung trong vùng chọn.');

            const blob = await fetch(dataUrl).then((res) => res.blob());
            const formData = new FormData();
            formData.append('file', blob, 'screenshot.png');

            const response = await fetch('http://localhost:5000/extract-text', {
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
                const response = await getChapter(url, chapterNumber);
                setChapter(response.data);
                setTotalChapters(response.data.totalChapters);
            } catch (error) {
                console.error('Error fetching chapter:', error);
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
        const handleClickOutside = () => setManual('');
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleDeckCreated = () => {
        fetchDecks();
        setIsModalOpen(false);
    };

    if (loading) return <LoadingData />;

    return (
        <div className="chapter-reader">
            <div className="chapter-container">
                <div
                    className={`main-content ${isScreenshotMode ? 'screenshot-mode' : ''}`}
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
                                setManual((prev) => (prev === 'list-chap' ? '' : 'list-chap'));
                            }}
                        >
                            <a>
                                <i className="fa-solid fa-bars"></i>
                            </a>
                            <div className="chapter-manual__popup">
                                <div className="list-chapter">
                                    <ChapterTab url={url} col={2} fontsize={15} />
                                </div>
                            </div>
                        </li>
                        {chapterNumber > 1 && (
                            <li className="chapter-manual__item">
                                <Link
                                    to={routeLink.chapterDetail
                                        .replace(':url', url)
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
                                        .replace(':url', url)
                                        .replace(':chapterNumber', Number(chapterNumber) + 1)}
                                >
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </li>
                        )}
                        <li className="chapter-manual__item">
                            <Link to={routeLink.comicDetail.replace(':url', url)}>
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                            </Link>
                        </li>
                        <li
                            className={`chapter-manual__item ${isScreenshotMode ? 'active' : ''}`}
                            onClick={toggleScreenshotMode}
                        >
                            <a>
                                <i className="fa-solid fa-camera"></i>
                            </a>
                        </li>
                    </ul>

                    {selection && (
                        <div
                            className="selection-area"
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
                                    onClick={() =>
                                        setOcrResult({ text: '', pronunciation: '', translation: '' })
                                    }
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
                                                <p className="ocr-pronunciation">
                                                    {ocrResult.pronunciation}
                                                </p>
                                            </div>
                                        )}
                                        {ocrResult.translation && (
                                            <div className="ocr-section">
                                                <h4>Bản dịch:</h4>
                                                <p className="ocr-translation">{ocrResult.translation}</p>
                                            </div>
                                        )}

                                        <div className="create-card-section">
                                            <h4>Tạo thẻ học</h4>
                                            <div className="form-group">
                                                <label>Chọn bộ thẻ (Deck)</label>
                                                <div className="deck-selection">
                                                    <select className="form-control" id="deckSelect">
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
                                                        className="btn btn-secondary add-deck-btn"
                                                        onClick={() => setIsModalOpen(true)}
                                                    >
                                                        Thêm bộ thẻ
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="button-group">
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={async () => {
                                                        try {
                                                            const selectedDeck = document.getElementById('deckSelect').value;
                                                            if (!selectedDeck) {
                                                                alert('Vui lòng chọn một bộ thẻ trước khi thêm!');
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
                                                        } catch (error) {
                                                            console.error('Lỗi khi tạo thẻ:', error);
                                                            toast.error('Có lỗi xảy ra khi thêm thẻ. Vui lòng thử lại.');
                                                        }
                                                    }}
                                                >
                                                    Thêm thẻ
                                                </button>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() =>
                                                        setOcrResult({
                                                            text: '',
                                                            pronunciation: '',
                                                            translation: '',
                                                        })
                                                    }
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

                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <DeckFormPage
                                onDeckCreated={handleDeckCreated}
                                onClose={() => setIsModalOpen(false)}
                            />
                        </div>
                    </div>
                )}

                {isScreenshotMode && (
                    <div className="screenshot-instruction">Kéo chuột để chọn vùng cần chụp</div>
                )}
            </div>
        </div>
    );
}

export default ChapterDetail;