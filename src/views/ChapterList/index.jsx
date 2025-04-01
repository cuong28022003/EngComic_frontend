import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Grid from '../../components/Grid';
import { routeLink } from '../../routes/AppRoutes';
import { getChapters, deleteChapter } from '../../api/chapterApi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ChapterList = () => {
    const { url } = useParams();
    const user = useSelector((state) => state.auth.login.user);
    const dispatch = useDispatch();
    const [chapters, setChapters] = useState([]);
    const loginSuccess = useSelector((state) => state.auth.login.success);

    const onClickUpdateChap = (e) => {
        // setChapterNumber(e.target.name);
        // setAddChapter(true);
    };
    const onClickDeleteChap = (e) => {
        if (e.target.name) {
            deleteChapter(
                { url: url, chapterNumber: e.target.name },
                user,
                dispatch,
                loginSuccess
            )
                .then((res) => {
                    toast.success("Xóa chương thành công");
                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(err.response.details.message);
                });
        }
    };

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const params = { url: url };
                const res = await getChapters(params);
                // console.log("res: ", res);  
                if (res.data.content) {
                    setChapters(res.data.content);
                }
            } catch (error) {
                console.error("Failed to fetch chapters: ", error);
            }
        }
        fetchChapters();
    }, []);

    return (
        <>
            <div>
                <div className="d-flex" style={{ justifyContent: "space-between" }}>
                    <a onClick={() => window.history.back()}>
                        <i className="fa-solid fa-angle-left"></i> Danh sách truyện
                    </a>
                    <span className="fs-20 fw-6">Danh sách chương</span>
                    <Link
                        className="btn-primary"
                        style={{ margin: "0px 10px" }}
                        to={routeLink.createChapter.replace(":url", url)}
                    >
                        Thêm chương
                    </Link>
                </div>
                {chapters.length > 0 ? (
                    <Grid gap={15} col={2} snCol={1}>
                        {chapters.map((item, index) => {
                            return (
                                <div key={item.chapterNumber}>
                                    <div className="d-flex">
                                        <div
                                            className="col-10 d-flex"
                                            style={{ alignItems: "center" }}
                                        >
                                            <a
                                                key={item.chapterNumber}
                                                name={item.chapterNumber}
                                                className="text-overflow-1-lines"
                                            >
                                                {item.name}
                                            </a>
                                        </div>
                                        <div className="col-2">
                                            <a onClick={onClickUpdateChap} name={item.chapterNumber}>
                                                <i className="fa-solid fa-marker"></i> Sửa
                                            </a>
                                            <a onClick={onClickDeleteChap} name={item.chapterNumber}>
                                                <i className="fa-solid fa-trash"></i> Xóa
                                            </a>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            );
                        })}
                    </Grid>
                ) : (
                    <p>Không có chương nào để hiển thị.</p>
                )}
            </div>
        </>
    );
};

export default ChapterList;