import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteComic, searchComics } from '../../../../../api/comicApi';
import { loginSuccess } from '../../../../../redux/slice/auth';
import { routeLink } from '../../../../../routes/AppRoutes';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../../../../components/ConfirmDialog';
import Loading from '../../../../../components/Loading';
import LoadingData from '../../../../../components/LoadingData';
import Pagination from '../../../../../components/Pagination';
import './styles.scss';

const CreatedTab = ({ isReadOnly }) => {
    const navigate = useNavigate();
    console.log("isReadOnly: ", isReadOnly);
    const { userId } = useParams();
    const [comics, setComics] = useState([]);
    const user = useSelector((state) => state.auth.login.user);
    const dispatch = useDispatch();

    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteComicId, setDeleteComicId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(5); // Số truyện trên mỗi trang

    const getComics = async () => {
        const params = {
            uploaderId: userId ? userId : user.id,
            page: currentPage - 1, // API sử dụng 0-based index
            size: pageSize,
        }
        setLoadingData(true);
        await searchComics(params)
            .then((res) => {
                const data = res.data.content;
                setComics(data);
                setTotalPages(res.data.totalPages);
            })
            .catch((err) => {
                console.log(err);
            });
        setLoadingData(false);
    };

    useEffect(async () => {
        getComics();
    }, [userId, user, currentPage]);

    const handleDeleteClick = (e) => {
        setDeleteComicId(e.target.name);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteComicId) {
            setIsDeleting(true);
            await deleteComic(deleteComicId, user, dispatch, loginSuccess)
                .then((res) => {
                    getComics();
                    toast.success("Xóa truyện thành công!");
                })
                .catch(() => {
                    toast.error("Đã xảy ra lỗi!");
                })
                .finally(() => {
                    setIsDeleting(false);
                });
        }
        setShowConfirm(false);
        setDeleteComicId(null);
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDeleteComicId(null);
    };

    const onClickComic = (e) => {
        navigate(routeLink.comicDetail.replace(':comicId', e.target.name));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            {
                loadingData ? (
                    <LoadingData />
                ) :
                    comics.length > 0 ? (
                        comics.map((comic) => {
                            return (
                                <div key={comic.id}>
                                    <div className="reading-card">
                                        <div className="reading-card__img-wrap">
                                            <img src={comic.imageUrl} alt="" />
                                        </div>
                                        <div className="reading-card__content">
                                            <a
                                                onClick={onClickComic}
                                                name={comic?.id}
                                                className="reading-card__title"
                                            >
                                                {comic.name}
                                            </a>
                                            <p className={`created-status ${comic.status.toLowerCase()}`}>
                                                Trạng thái: {comic.status === 'PENDING' ? 'Chờ duyệt' :
                                                    comic.status === 'LOCK' ? 'Đã khóa' :
                                                        comic.status === 'APPROVED' ? 'Đã duyệt' :
                                                            comic.status}
                                            </p>
                                            <div className="d-flex" style={{ gap: "15px" }}>
                                                {!isReadOnly && (
                                                    <Link to={routeLink.editComic.replace(':comicId', comic.id)} name={comic.id} state={{ url: comic?.url }}>
                                                        <i className="fa-solid fa-marker"></i> Sửa
                                                    </Link>
                                                )}
                                                {!isReadOnly && (
                                                    <a onClick={handleDeleteClick} name={comic.id}>
                                                        <i className="fa-solid fa-trash"></i> Xóa
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            );
                        })
                    ) : (
                        <p>Không có truyện nào để hiển thị.</p>
                    )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {showConfirm && (
                <ConfirmDialog
                    message="Bạn có chắc chắn muốn xóa truyện này không?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}

            {isDeleting && <Loading />}
        </>
    );
};

export default CreatedTab;