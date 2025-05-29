import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Loading from '../../../../../../components/Loading/Loading';
import LoadingData from '../../../../../../components/Loading/LoadingData';
import { getComic, updateComic } from '../../../../../../api/comicApi';
import { ComicGenres } from '../../../../../../constant/enum'; 
import { storage } from '../../../../../../firebaseConfig';
import { useLocation } from 'react-router-dom';

function EditComic() {
    const location = useLocation();
    const user = useSelector((state) => state.auth.login.user);
    const dispatch = useDispatch();
    const [image, setImage] = useState("");
    const [preview, setPreview] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [artist, setArtist] = useState("");
    const [genre, setGenre] = useState("");
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(false);
    const loginSuccess = useSelector((state) => state.auth.loginSuccess);
    const [loadingStory, setLoadingStory] = useState(true);
    const url = location.state?.url;
    // console.log("url: " + url);
    const [isUploading, setIsUploading] = useState(false);
    
    useEffect(async () => {
        if (url) {
            await getComic(url).then((res) => {
                // console.log(res);
                const comic = res.data;
                setPreview(comic.image);
                setName(comic.name);
                setDescription(comic.description);
                setGenre(comic.genre);
                setArtist(comic.artist);
                setId(comic.id);
                setLoadingStory(false);
            });
        }
    }, []);

    const handleEditComic = async (data) => {
        try {
            // console.log("data: " + data);
            await updateComic(data, user, dispatch, loginSuccess)
                .then((res) => {
                    console.log(res);
                    toast.success("Sửa truyện thành công");
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                    toast.error(err.response?.details.message);
                });
        } catch (error) {
            console.log(error);
            toast.error("Lỗi cập nhật thông tin");
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Normalize and generate URL slug based on the updated name
        const updatedUrl = name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
            .split(" ")
            .filter((i) => i !== " ")
            .join("-")
            .toLowerCase();

        let data = {
            name: name,
            artist: artist,
            genre: genre,
            description: description,
            url: updatedUrl,
            id: id,
        };

        if (image) {
            // Upload image if a new one is provided
            const storageRef = ref(storage, `/images/truyen/${updatedUrl}`);
            uploadBytes(storageRef, image).then((result) => {
                getDownloadURL(result.ref).then(async (urlImage) => {
                    // Update the image URL in the data object
                    data.image = urlImage;
                    await handleEditComic(data);
                });
            });
        } else if (preview) {
            // Use the existing image preview if no new image is provided
            data.image = preview;
            await handleEditComic(data);
        } else {
            // Handle cases where no image is provided
            await handleEditComic(data);
        }
    };

    ///OnChange event
    const onChangeName = (e) => {
        setName(e.target.value);
    };

    const onChangeImage = (e) => {
        if (e.target.files.lenght !== 0) {
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const labelStyle = { minWidth: "100px", display: "inline-block" };
    return (
        <>
            {loadingStory ? (
                <LoadingData />
            ) : (
                <>
                    <a onClick={() => window.history.back()}>
                        <i className="fa-solid fa-angle-left"></i> Danh sách truyện
                    </a>
                    <div className="profile__wrap d-flex">
                        <div className="col-5 profile__avt">
                            <img src={preview} alt="" />
                            <input type={"file"} name={"avatar"} onChange={onChangeImage} />
                        </div>
                        <div className="col-7 ">
                            <div className="profile__main">
                                <form>
                                    <div className="group-info">
                                        <label htmlFor="" style={labelStyle}>
                                            Tên truyện
                                        </label>
                                        <input onChange={onChangeName} value={name || ""} />
                                    </div>
                                    <div className="group-info">
                                        <label htmlFor="" style={labelStyle}>
                                            Mô tả
                                        </label>
                                        <input
                                            onChange={(e) => {
                                                setDescription(e.target.value);
                                            }}
                                            value={description}
                                        ></input>
                                    </div>
                                    <div className="group-info">
                                        <label style={labelStyle}>Tác giả</label>
                                        <input
                                            required
                                            onChange={(e) => {
                                                setArtist(e.target.value);
                                            }}
                                            value={artist}
                                        ></input>
                                    </div>
                                    <div className="group-info">
                                        <label htmlFor="types">Thể loại</label>
                                        <select
                                            style={labelStyle}
                                            onChange={(e) => {
                                                // console.log(e.target.value);
                                                setGenre(e.target.value);
                                            }}
                                            value={genre}
                                            id="types"
                                            name="types"
                                        >
                                            {ComicGenres.map((item) => {
                                                return <option key={item} value={item}>{item}</option>;
                                            })}
                                        </select>
                                    </div>
                                    <div className="d-flex">
                                        <button onClick={handleEdit}>
                                            {loading ? <Loading /> : ""} Sửa truyện
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default EditComic;