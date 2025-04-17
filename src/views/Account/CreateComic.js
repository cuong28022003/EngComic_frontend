import { useState, useEffect } from 'react';
import apiMain from '../../api/apiMain';
import { loginSuccess } from '../../redux/slice/auth';
import { useSelector, useDispatch } from 'react-redux'
import avt from '../../assets/img/avt.png'
import { storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { setLoading } from '../../redux/messageSlice'
import Loading from '../../components/Loading/Loading';
import LoadingData from '../../components/Loading/LoadingData';
import { useNavigate } from 'react-router-dom';
import { ComicGenres } from '../../constant/enum';
import { createComic } from '../../api/comicApi';
import { routeLink } from '../../routes/AppRoutes';

function CreateComic() {
    const user = useSelector(state => state.auth.login.user)
    const [image, setImage] = useState("");
    const [preview, setPreview] = useState(avt)
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [artist, setArtist] = useState("");
    const [genre, setGenre] = useState(ComicGenres[0]);
    const loading = useSelector(state => state.message.loading)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const handleCreate = async (e) => {//xử lý tạo truyện
        e.preventDefault()
        if (!name || !image || !artist || !description || !genre) {
            toast.warning("Vui lòng điền đầy đủ các thông tin bắt buộc!");
            return;
        }
        dispatch(setLoading(true))
        const url = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').filter(i => i !== '').join('-').toLowerCase()
        const storageRef = ref(storage, `/images/truyen/${url}`);
        uploadBytes(storageRef, image).then((result) => {//upload ảnh
            getDownloadURL(result.ref).then(async (urlImage) => {//lấy liên kết tới ảnh
                const data = {//payload
                    name: name,
                    image: urlImage,
                    artist: artist,
                    description: description,
                    genre: genre,
                    url: url,
                    uploader: user?._id
                }
                await createComic(data, user, dispatch, loginSuccess)
                    .then(res => {
                        // console.log(res);
                        toast.success("Đăng truyện thành công")
                        dispatch(setLoading(false))
                        navigate(routeLink.comics);
                    })
                    .catch(err => {
                        dispatch(setLoading(false))
                        toast.error("Đăng truyện thất bại")
                    })
            })
        });
    }

    ///OnChange event
    const onChangeName = (e) => {
        setName(e.target.value)
    }

    const onChangeImage = (e) => {
        if (e.target.files.lenght !== 0) {
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]))
        }
    }

    const labelStyle = { 'minWidth': '100px', 'display': 'inline-block' }
    return (
        <>
            {
                !user ? <LoadingData />
                    :
                    <div className="profile__wrap d-flex">
                        <div className="col-5 profile__avt">
                            <img src={preview} alt="" />
                            <input type={"file"} accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff, .webp|image/*" name={"avatar"} onChange={onChangeImage} />
                        </div>
                        <div className="col-7 ">
                            <div className="profile__main">
                                <form>
                                    <div className="group-info">
                                        <label htmlFor="" style={labelStyle}>Tên truyện</label>
                                        <input onChange={onChangeName} value={name || ""} />
                                    </div>
                                    <div className="group-info">
                                        <label htmlFor="" style={labelStyle}>Mô tả</label>
                                        <input onChange={e => { setDescription(e.target.value) }} value={description}></input>
                                    </div>
                                    <div className="group-info">
                                        <label style={labelStyle}>Tác giả</label>
                                        <input required onChange={e => { setArtist(e.target.value) }} value={artist}></input>
                                    </div>
                                    <div className="group-info">
                                        <label htmlFor="">Thể loại</label>
                                        <select style={labelStyle} onChange={e => { console.log(e.target.value); setGenre(e.target.value) }} value={genre} id="types" name="types">
                                            {
                                                ComicGenres.map((genre, index) => (
                                                    <option key={index} value={genre}>
                                                        {genre}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="d-flex">
                                        <button onClick={handleCreate}>{loading ? <Loading /> : ''} Đăng truyện</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
            }</>

    )
}

export default CreateComic