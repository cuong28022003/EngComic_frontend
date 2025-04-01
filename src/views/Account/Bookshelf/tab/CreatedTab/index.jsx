import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getComicsByUsername, deleteComic } from '../../../../../api/comicApi';
import { loginSuccess } from '../../../../../redux/slice/auth';
import { routeLink } from '../../../../../routes/AppRoutes';
import { Link } from 'react-router-dom';

const CreatedTab = () => {
    const [comics, setComics] = useState([]);
    const user = useSelector((state) => state.auth.login.user);
    const dispatch = useDispatch();
    const [url, setUrl] = useState("");
    useEffect(async () => {
        getComics();
    }, user);

    const getComics = async () => {
        await getComicsByUsername({ username: user.username })
            .then((res) => {
                setComics(res.content);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onClickUpdateComic = (e) => {
        // setEditNovel(true);
        setUrl(e.target.name);
    };
    const onClickDeleteComic = async (e) => {
        // console.log(e.target.name);
        if (e.target.name) {
            await deleteComic(e.target.name, user, dispatch, loginSuccess)
                .then((res) => {
                    console.log(res);
                    getComics();
                    toast.success(res.data.message);
                })
                .catch((err) => {
                    toast.error("Đã xảy ra lỗi!");
                });
        }
    };

    const onClickBackFromListChap = useCallback(() => {
        // setListChap(false);
        // setEditNovel(false);
    });

    const onClickComic = (e) => {
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
                comics.map((data) => {
                    return (
                        <div key={data._id}>
                            <div className="reading-card">
                                <div className="reading-card__img-wrap">
                                    <img src={data.image} alt="" />
                                </div>
                                <div className="reading-card__content">
                                    <a
                                        onClick={onClickComic}
                                        name={data?.url}
                                        className="reading-card__title"
                                    >
                                        {data.name}
                                    </a>
                                    <div className="d-flex" style={{ gap: "15px" }}>
                                        <Link to={routeLink.editComic.replace(':url', data.url)} name={data.url} state={{url: data?.url}}>
                                            <i className="fa-solid fa-marker"></i> Sửa
                                        </Link>
                                        <a onClick={onClickDeleteComic} name={data.url}>
                                            <i className="fa-solid fa-trash"></i> Xóa
                                        </a>
                                        <Link to={routeLink.chapters.replace(':url', data.url)} name={data.url} state={{url: data?.url}}>
                                            <i className="fa-solid fa-list"></i> Danh sách chương
                                        </Link>
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
        </>
    );
};

export default CreatedTab;