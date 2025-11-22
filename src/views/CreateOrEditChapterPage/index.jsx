import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { getChapterById, updateChapter, createChapter } from '../../api/chapterApi';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../redux/slice/auth';
import { routeLink } from '../../routes/AppRoutes';

function CreateOrEditChapterPage() {
    const user = useSelector(state => state.auth.login.user);
    const dispatch = useDispatch();

    const location = useLocation();
    const navigate = useNavigate();
    const { comicId, chapterId } = useParams();

    const isEdit = Boolean(chapterId);

    const nextChapterNumber = location.state?.nextChapterNumber || 1;
    const existedNumbers = location.state?.existedNumbers || [];

    const [name, setName] = useState('');
    const [chapterNumber, setChapterNumber] = useState(nextChapterNumber);
    const [pages, setPages] = useState([]);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState(null);

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            getChapterById(chapterId)
                .then(res => {
                    const chapter = res.data;
                    setName(chapter.name);
                    setChapterNumber(chapter.chapterNumber);
                    setPreviewImageUrl(chapter.imageUrl || null);
                })
                .catch(() => toast.error("Không tải được chương"))
                .finally(() => setLoading(false));
        }
    }, [chapterId]);

    const handlePagesChange = (e) => {
        const files = Array.from(e.target.files);

        const newPages = files.map((file) => {
            const order = parseInt(file.name.match(/\d+/)?.[0] || '0', 10);
            return {
                file,
                order,
                previewUrl: URL.createObjectURL(file),
            };
        });

        // Dùng Map để loại trùng theo order
        const orderMap = new Map();

        // Đưa các trang cũ vào map
        pages.forEach((page) => {
            orderMap.set(page.order, page);
        });

        // Ghi đè bằng trang mới nếu trùng order
        newPages.forEach((page) => {
            orderMap.set(page.order, page);
        });

        // Chuyển map thành mảng và sắp xếp theo order
        const combined = Array.from(orderMap.values()).sort((a, b) => a.order - b.order);

        setPages(combined);
    };


    const handleRemovePage = (index) => {
        const updated = [...pages];
        updated.splice(index, 1);
        setPages(updated);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setPreviewImageUrl(URL.createObjectURL(file));
        } else {
            setPreviewImageUrl(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !chapterNumber) {
            toast.warning("Vui lòng điền đầy đủ thông tin");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("chapterNumber", chapterNumber);
        formData.append("comicId", comicId);
        pages.forEach(page => formData.append("pages", page.file));
        if (image) formData.append("image", image);

        try {
            if (isEdit) {
                await updateChapter(chapterId, formData, user, dispatch, loginSuccess);
                toast.success("Cập nhật chương thành công");
            } else {
                await createChapter(formData, user, dispatch, loginSuccess);
                toast.success("Tạo chương thành công");
            }
            navigate(routeLink.editComic.replace(":comicId", comicId));
        } catch {
            toast.error("Lỗi khi lưu chương");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-edit-chapter-container">
            <h2>{isEdit ? "Chỉnh sửa chương" : "Tạo chương mới"}</h2>
            <div className="chapter-grid">
                <form className="chapter-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className='input-label'>Tên chương</label>
                        <input className='input' type="text" value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label className='input-label'>Số chương</label>
                        <input
                            className='input'
                            type="number"
                            value={chapterNumber}
                            min={1}
                            onChange={e => {
                                const val = Number(e.target.value);
                                // Nếu số này đã tồn tại và không phải đang edit chính nó thì không cho nhập
                                if (!isEdit && existedNumbers.includes(val)) {
                                    toast.warning("Số chương này đã tồn tại!");
                                    return;
                                }
                                setChapterNumber(val);
                            }}
                            disabled={isEdit}
                        />
                    </div>

                    <div className="input-group">
                        <label className='input-label'>Ảnh bìa (nếu có)</label>
                        <input className='input' type="file" accept="image/*" onChange={handleImageChange} />
                    </div>

                    {previewImageUrl && (
                        <div className="cover-preview">
                            <p>Xem trước ảnh bìa:</p>
                            <img src={previewImageUrl} alt="Ảnh bìa" />
                        </div>
                    )}

                    <button type="submit" className="button-secondary" disabled={loading}>
                        {loading ? <Loading /> : isEdit ? "Lưu chương" : "Tạo chương"}
                    </button>
                </form>

                <div className="chapter-upload">
                    <div className="input-group">
                        <label className='input-label'>Chọn trang truyện</label>
                        <input className='input' type="file" accept="image/*" multiple onChange={handlePagesChange} />
                    </div>

                    <div className="pages-preview">
                        {pages.map((p, index) => (
                            <div key={index} className="page-item">
                                <span className="order">{p.order}</span>
                                <img src={p.previewUrl} alt={`Trang ${p.order}`} />
                                <button className="remove-btn" onClick={() => handleRemovePage(index)}>X</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateOrEditChapterPage;
