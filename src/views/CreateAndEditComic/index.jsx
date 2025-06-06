import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import avt from '../../assets/image/avt.png';
import { ComicGenres } from '../../constant/enum';
import { createComic, getComicById, updateComic } from '../../api/comicApi';
import { loginSuccess } from '../../redux/slice/auth';
import { routeLink } from '../../routes/AppRoutes';

import Loading from '../../components/Loading/Loading';
import { getChaptersByComicId, deleteChapterById } from '../../api/chapterApi';
import ConfirmDialog from '../../components/ConfirmDialog';

import './styles.scss';

function CreateAndEditComicPage() {
    const user = useSelector(state => state.auth.login.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { comicId } = useParams();
    const isEdit = Boolean(comicId);

    const [loadingPage, setLoadingPage] = useState(isEdit);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [artist, setArtist] = useState('');
    const [genre, setGenre] = useState(ComicGenres[0]);
    const [image, setImage] = useState('');
    const [preview, setPreview] = useState(avt);
    const [background, setBackground] = useState('');
    const [previewBackground, setPreviewBackground] = useState(avt);

    const [chapters, setChapters] = useState([]);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedChapterId, setSelectedChapterId] = useState(null);

    useEffect(() => {
        getChaptersByComicId(comicId).then((res) => {
            const data = res.data.content;
            setChapters(data);
        }).catch(() => {
            setChapters([]);
            console.error("Không tải được danh sách chương");
        });
        setLoadingPage(false);
    }, [comicId]);

    useEffect(() => {
        if (isEdit) {
            getComicById(comicId).then((res) => {
                const comic = res.data;
                setName(comic.name);
                setDescription(comic.description);
                setArtist(comic.artist);
                setGenre(comic.genre);
                setPreview(comic.imageUrl);
                setPreviewBackground(comic.backgroundUrl);
                setLoadingPage(false);
            }).catch(() => {
                toast.error("Không tìm thấy truyện");
                setLoadingPage(false);
            });
        } else {
            setPreview(require('../../assets/image/avt.png'));
        }
    }, [comicId, isEdit]);

    const handleAddChapter = () => {
        // Tìm số chương lớn nhất hiện có
        const maxChapter = chapters.length > 0
            ? Math.max(...chapters.map(chap => Number(chap.chapterNumber)))
            : 0;
        // Truyền chapterNumber tiếp theo qua state
        navigate(routeLink.createChapter.replace(':comicId', comicId), {
            state: { nextChapterNumber: maxChapter + 1, existedNumbers: chapters.map(chap => Number(chap.chapterNumber)) }
        });
    };

    const handleEditChapter = (chapterId) => {
        navigate(routeLink.editChapter.replace(':comicId', comicId).replace(':chapterId', chapterId));
    };

    const handleDeleteChapterClick = (chapterId) => {
        setSelectedChapterId(chapterId);
        setShowConfirm(true);
    };

    const handleDeleteChapter = () => {
        setLoadingPage(true);
        deleteChapterById(selectedChapterId, user, dispatch, loginSuccess)
            .then(() => {
                toast.success("Đã xoá chương thành công.");
                setChapters(prev => prev.filter(chap => chap.id !== selectedChapterId));
                setLoadingPage(false);
                setShowConfirm(false);
                setSelectedChapterId(null);
                navigate(routeLink.editComic.replace(':comicId', comicId));
            })
            .catch((err) => {
                console.error(err);
                toast.error("Xoá chương thất bại.");
                setLoadingPage(false);
                setShowConfirm(false);
                setSelectedChapterId(null);
            });
        navigate(routeLink.editComic.replace(':comicId', comicId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !description || !artist || !genre || (!preview && !image)) {
            toast.warning("Vui lòng điền đầy đủ thông tin");
            return;
        }

        setLoadingPage(true);

        const slug = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .split(' ').filter(Boolean).join('-').toLowerCase();

        try {
            const formData = new FormData();
            formData.append("data", new Blob([JSON.stringify({
                name,
                description,
                artist,
                genre,
                url: slug,
                uploaderId: user?.id,
            })], { type: "application/json" }));
            if (image) {
                formData.append("image", image);
            }
            if (background) {
                formData.append("background", background);
            }

            if (isEdit) {
                await updateComic(comicId, formData, user, dispatch, loginSuccess);
                toast.success("Cập nhật truyện thành công!");
                navigate(routeLink.comics);
            } else {
                await createComic(formData, user, dispatch, loginSuccess);
                toast.success("Đăng truyện thành công!");
                navigate(routeLink.comics);
            }
        } catch (error) {
            toast.error("Đăng truyện thất bại!");
        } finally {
            setLoadingPage(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleBackgroundChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackground(file);
            setPreviewBackground(URL.createObjectURL(file));
        }
    };

    if (loadingPage) return <Loading />;

    return (
        <div className="form-wrapper">
            <div className="form-left">
                <div className="create-comic">
                    <form className="comic-form" onSubmit={handleSubmit}>
                        <div className="left-section">
                            <h2>{isEdit ? "Chỉnh sửa truyện" : "Tạo truyện mới"}</h2>

                            <div className="image-preview cover-preview">
                                <img src={preview} alt="preview" />
                                <input className='input' type="file" accept="image/*" onChange={handleImageChange} />
                            </div>
                            <div className="image-preview background-preview">
                                <img src={previewBackground} alt="background-preview"/>
                                <input className='input' type="file" accept="image/*" onChange={handleBackgroundChange} />
                            </div>
                        </div>
                        <div className="right-section">
                            <div className="input-group">
                                <label className="input-label">Tên truyện *</label>
                                <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Mô tả *</label>
                                <textarea className="textarea" value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label className='input-label'>Tác giả *</label>
                                <input className='input' type="text" value={artist} onChange={e => setArtist(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label className='input-label'>Thể loại *</label>
                                <select className='select' value={genre} onChange={e => setGenre(e.target.value)}>
                                    {ComicGenres.map((g, idx) => <option key={idx} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <button className='button-primary' type="submit" disabled={loadingPage}>
                                {isEdit ? "Lưu thay đổi" : "Tạo truyện"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="right-panel">
                <button className="button-secondary" onClick={handleAddChapter}>+ Thêm chương</button>
                <div className="chapter-list">
                    {chapters.length === 0 ? (
                        <div className="empty-chapter">Chưa có chương nào.</div>
                    ) : (
                        chapters.map(chap => (
                            <div key={chap.id} className="chapter-item">
                                <span>{chap.name}</span>
                                <div className="chapter-actions">
                                    <button onClick={() => handleEditChapter(chap.id)}>✏️</button>
                                    <button onClick={() => handleDeleteChapterClick(chap.id)}>🗑️</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showConfirm && (
                <ConfirmDialog
                    message="Bạn có chắc chắn muốn xoá chương này không?"
                    onConfirm={handleDeleteChapter}
                    onCancel={() => { setShowConfirm(false); setSelectedChapterId(null); }}
                />
            )}
        </div>

    );
}

export default CreateAndEditComicPage;
