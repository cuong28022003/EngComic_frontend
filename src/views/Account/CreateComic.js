import { useState, useEffect } from 'react';
import apiMain from '../../api/apiMain';
import { loginSuccess } from '../../redux/authSlice';
import { useSelector, useDispatch } from 'react-redux'
import avt from '../../assets/img/avt.png'
import { storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { setLoading } from '../../redux/messageSlice'
import Loading from '../../components/Loading';
import LoadingData from '../../components/LoadingData';
import getData from '../../api/getData';

function CreateNovel({ userInfo }) {
    const types = [
        "Hành động",
        "Phiêu lưu",
        "Hài hước",
        "Siêu nhiên",
        "Thể thao",
        "Giả tưởng",
        "Mecha",
        "Khoa học viễn tưởng",
        "Tâm lý / Kịch tính",
        "Trinh thám / Bí ẩn"
    ];
    const user = useSelector(state => state.auth.login.user)
    const [image, setImage] = useState("");
    const [preview, setPreview] = useState(avt)
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [artist, setArtist] = useState("");
    const [genre, setGenre] = useState(types[0]);
    const loading = useSelector(state => state.message.loading)
    const [loadingUser, setLoadingUser] = useState(true)
    const dispatch = useDispatch()


    useEffect(() => {
        const loadUser = async () => {
            if (userInfo) {
                setLoadingUser(false)
            }
        }
        loadUser();
    }, [userInfo])


    const handleCreateNovel = async (data) => {//xử lý gọi tạo truyện mới
        try {
            apiMain.createComic(data, user, dispatch, loginSuccess)
                .then(res => {
                    toast.success("Đăng truyện thành công")
                    dispatch(setLoading(false))
                })
                .catch(err => {

                    dispatch(setLoading(false))
                    toast.error(getData(err.response)?.details.message)
                })
        } catch (error) {
            console.log(error)
            toast.error("Lỗi cập nhật thông tin")
        }
    }

    const handleCreate = async (e) => {//xử lý tạo truyện
        e.preventDefault()
        if (image == null)
            return;
        dispatch(setLoading(true))
        const url = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').filter(i => i !== '').join('-').toLowerCase()
        const storageRef = ref(storage, `/images/truyen/${url}`);
        uploadBytes(storageRef, image).then((result) => {//upload ảnh
            getDownloadURL(result.ref).then(async (urlImage) => {//lấy liên kết tới ảnh
                const data = {//payload
                    name: name,
                    image: urlImage,
                    artist,
                    description,
                    genre,
                    url,
                    uploader: userInfo?._id
                }
                await handleCreateNovel(data)//gọi API
            })
        })

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
                loadingUser ? <LoadingData />
                    :
                    <div className="profile__wrap d-flex">
                        <div className="col-5 profile__avt">
                            <img src={preview} alt="" />
                            <input type={"file"} accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" name={"avatar"} onChange={onChangeImage} />
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
                                        <label for="types">Thể loại</label>
                                        <select style={labelStyle} onChange={e => { console.log(e.target.value); setGenre(e.target.value) }} value={genre} id="types" name="types">
                                            {
                                                types.map(item => { return (<option value={item}>{item}</option>) })
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

export default CreateNovel