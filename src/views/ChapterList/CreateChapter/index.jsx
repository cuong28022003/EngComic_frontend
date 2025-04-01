import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createChapter } from '../../../api/chapterApi';
import { routeLink } from '../../../routes/AppRoutes';
import Loading from '../../../components/Loading/Loading';

const CreateChapter = () => {
    const { url } = useParams()
    const [name, setName] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.auth.login.user);
    const navigate = useNavigate();

    // Hàm xử lý chọn ảnh
    const handleFileChange = (e) => {
        setSelectedImages([...e.target.files]);
    };

    // Load dữ liệu khi sửa chương
    // useEffect(() => {
    //     if (chapterNumber) {
    //         apiMain.getChapterByNumber(url, chapterNumber).then((res) => {
    //             setName(res.tenchap);
    //             setSelectedImages([]); // Xóa danh sách ảnh cũ, chỉ hiển thị ảnh đã tải lên từ API
    //             setEdit(true);
    //         });
    //     }
    // }, [chapterNumber, url]);

    const onClickAddChapter = async () => {
        if (!name) {
            toast.warning("Tên chương không được để trống.");
            return;
        }

        if (selectedImages.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một ảnh.");
            return;
        }

        try {
            // Chuẩn bị dữ liệu để gửi API
            const formData = new FormData();
            for (const image of selectedImages) {
                formData.append("images", image);
            }
            formData.append("name", name);
            formData.append("url", url);

            await createChapter(formData, user);
            setLoading(false);
            toast.success("Thêm chương thành công.");
            navigate(`${routeLink.chapters.replace(":url", url)}`);

            // Gửi dữ liệu tới API
            // if (edit) {
            //     await apiMain.updateChapter(chapterNumber, formData, user);
            //     dispatch(setLoading(false));
            //     toast.success("Cập nhật chương thành công.");
            // } else {
                
            
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi thêm/cập nhật chương, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="d-flex" style={{ justifyContent: "space-between" }}>
                <a onClick={() => window.history.back()}>
                    <i className="fa-solid fa-angle-left"></i> Danh sách chương
                </a>
                <span className="fs-20 fw-6">
                    {edit ? "Chỉnh sửa chương" : "Thêm chương"}
                </span>
            </div>

            <div>
                <label>Tên chương:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên chương"
                />

                <label>Ảnh chương:</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />

                {selectedImages.length > 0 && (
                    <div>
                        <h4>Ảnh đã chọn:</h4>
                        {Array.from(selectedImages).map((file, index) => (
                            <img
                                key={index}
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                style={{ width: "100px", margin: "5px" }}
                            />
                        ))}
                    </div>
                )}

                <button onClick={onClickAddChapter} className="btn-primary">
                    {loading ? <Loading /> : ''}
                    {edit ? "Cập nhật chương" : "Thêm chương"}
                </button>
            </div>
        </div>
    );
};

export default CreateChapter;