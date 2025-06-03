import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getComicsByUploaderId, deleteComic, searchComics } from '../../../../../api/comicApi';
import { loginSuccess } from '../../../../../redux/slice/auth';
import { routeLink } from '../../../../../routes/AppRoutes';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../../../../components/ConfirmDialog';

const CreatedTab = ({ isReadOnly }) => {
    const navigate = useNavigate();
    console.log("isReadOnly: ", isReadOnly);
    const { userId } = useParams();
    const [comics, setComics] = useState([]);
    const user = useSelector((state) => state.auth.login.user);
    const dispatch = useDispatch();

    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteComicId, setDeleteComicId] = useState(null);

    const getComics = async () => {
        const params = {
            uploaderId: userId ? userId : user.id,
            page: 0,
            size: 10, // Lấy tất cả truyện
        }
        await searchComics(params)
            .then((res) => {
                const data = res.data.content
                setComics(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(async () => {
        getComics();
    }, [userId, user]);


    const onClickUpdateComic = (e) => {
        // setEditNovel(true);
        // setUrl(e.target.name);
    };

    const handleDeleteClick = (e) => {
        setDeleteComicId(e.target.name);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteComicId) {
            await deleteComic(deleteComicId, user, dispatch, loginSuccess)
                .then((res) => {
                    getComics();
                    toast.success("Xóa truyện thành công!");
                })
                .catch(() => {
                    toast.error("Đã xảy ra lỗi!");
                });
        }
        setShowConfirm(false);
        setDeleteComicId(null);
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDeleteComicId(null);
    };

    const onClickBackFromListChap = useCallback(() => {
        // setListChap(false);
        // setEditNovel(false);
    });

    const onClickComic = (e) => {
        navigate(routeLink.comicDetail.replace(':comicId', e.target.name));
        // setUrl(e.target.name);
        // setListChap(true);
    };
    const onClickBackFromEditNovel = useCallback(() => {
        // setEditNovel(false);
    });
    return (
        <>
            {/* {listChap ? (
                <ListChap
                    onClickBackFromListChap={onClickBackFromListChap}
                    url={url}
                    user={user}
                />
            ) : editNovel ? (
                <EditComic
                    url={url}
                    user={user}
                    dispatch={dispatch}
                    onClickBackFromEditNovel={onClickBackFromEditNovel}
                />
                ) : */
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
            
            {showConfirm && (
                <ConfirmDialog
                    message="Bạn có chắc chắn muốn xóa truyện này không?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </>
    );
};

export default CreatedTab;