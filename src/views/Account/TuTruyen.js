import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiMain from "../../api/apiMain";
import { loginSuccess } from "../../redux/authSlice";
import Reading from "../../components/Reading";
import Grid from "../../components/Grid";
import {
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toast } from "react-toastify";
import getData from "../../api/getData";
import avt from "../../assets/img/avt.png";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setLoading } from "../../redux/messageSlice";
import Loading from "../../components/Loading";
import LoadingData from "../../components/LoadingData";
import Saved from "../../components/Saved";
const nav = [
  {
    path: "reading",
    display: "Đang đọc",
  },
  {
    path: "saved",
    display: "Đánh dấu",
  },
  {
    path: "created",
    display: "Đã đăng",
  },
];
function TuTruyen({ userInfo }) {
  const user = useSelector((state) => state.auth.login.user);
  console.log(user);
  const dispatch = useDispatch();
  const location = useLocation();
  const active = nav.findIndex(
    (e) => e.path === location.pathname.split("/").pop()
  );

  return (
    <>
      <div className="navigate">
        {nav.map((item, index) => {
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`navigate__tab fs-16 bold ${
                active === index ? "tab_active" : ""
              }`}
              name={item.path}
            >
              {item.display}
            </Link>
          );
        })}
      </div>

      <Routes>
        <Route
          key={"reading"}
          path="reading"
          element={<Readings key={"reading"} dispatch={dispatch} user={user} />}
        />
        <Route
          key={"saved"}
          path="saved"
          element={<Saveds key={"saved"} user={user} dispatch={dispatch} />}
        />
        <Route
          key={"created"}
          path="created"
          element={<StoryCreate key={"created"} userInfo={userInfo} />}
        />
      </Routes>
    </>
  );
}
const Readings = ({ dispatch, user }) => {
  const [readings, setReadings] = useState([]);
  useEffect(async () => {
    if (user) {
      apiMain
        .getReadings(user, dispatch, loginSuccess)
        .then((res) => {
          console.log(res);
          setReadings(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div>
      {readings.map((item, i) => (
        <div key={item._id}>
          <Reading
            data={item}
          />
          <hr />
        </div>
      ))}
    </div>
  );
};

const Saveds = ({ user, dispatch }) => {
  const [savedComics, setSavedComics] = useState([]);

  // Lấy danh sách truyện đã lưu từ API
  useEffect(() => {
    if (user) {
      const getSavedComics = async () => {
        try {
          const response = await apiMain.getSavedComics(
            user,
            dispatch,
            loginSuccess
          );
          console.log(response);
          setSavedComics(response);
        } catch (error) {
          console.log(error);
        }
      };
      getSavedComics();
    }
  }, [user]);

  return (
    <div className="saved-list">
      {savedComics.length > 0 ? (
        savedComics.map((comic) => (
          <div key={comic.id}>
            <Saved data={comic} />
            <hr />
          </div>
        ))
      ) : (
        <p>Chưa có truyện nào được đánh dấu.</p>
      )}
    </div>
  );
};

const StoryCreate = ({ userInfo }) => {
  const [comics, setComics] = useState([]);
  const [listChap, setListChap] = useState(false);
  const [editNovel, setEditNovel] = useState(false);
  const user = useSelector((state) => state.auth.login.user);
  const dispatch = useDispatch();
  const [url, setUrl] = useState("");
  useEffect(async () => {
    getComics();
  }, [userInfo]);

  const getComics = async () => {
    apiMain
      .getStorysByUsername({ username: userInfo?.username })
      .then((res) => {
        setComics(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onClickUpdateStory = (e) => {
    setEditNovel(true);
    setUrl(e.target.name);
  };
  const onClickDeleteStory = (e) => {
    console.log(e.target.name);
    if (e.target.name) {
      apiMain
        .deleteNovel({ url: e.target.name }, user, dispatch, loginSuccess)
        .then((res) => {
          console.log(res);
          getComics();
          toast.success(res.message, {
            hideProgressBar: true,
            autoClose: 1000,
            pauseOnHover: false,
          });
        })
        .catch((err) => {
          toast.error(getData(err.response)?.details.message, {
            hideProgressBar: true,
            autoClose: 1000,
            pauseOnHover: false,
          });
        });
    }
  };

  const onClickBackFromListChap = useCallback(() => {
    setListChap(false);
    setEditNovel(false);
  });

  const onClickComic = (e) => {
    setUrl(e.target.name);
    setListChap(true);
  };
  const onClickBackFromEditNovel = useCallback(() => {
    setEditNovel(false);
  });
  return (
    <>
      {listChap ? (
        <ListChap
          onClickBackFromListChap={onClickBackFromListChap}
          url={url}
          user={user}
        />
      ) : editNovel ? (
        <EditNovel
          url={url}
          user={user}
          dispatch={dispatch}
          onClickBackFromEditNovel={onClickBackFromEditNovel}
        />
      ) : (
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
                    <a onClick={onClickUpdateStory} name={data.url}>
                      <i className="fa-solid fa-marker"></i> Sửa
                    </a>
                    <a onClick={onClickDeleteStory} name={data.url}>
                      <i className="fa-solid fa-trash"></i> Xoá
                    </a>
                  </div>
                </div>
              </div>
              <hr />
            </div>
          );
        })
      )}
    </>
  );
};

const ListChap = ({ url, user, dispatch, onClickBackFromListChap }) => {
  const [chapters, setChapters] = useState([]);
  const location = useLocation();
  const [addChapter, setAddChapter] = useState(false);
  const [chapterNumber, setChapterNumber] = useState(null);

  const onClickUpdateChap = (e) => {
    setChapterNumber(e.target.name);
    setAddChapter(true);
  };
  const onClickDeleteChap = (e) => {
    if (e.target.name) {
      apiMain
        .deleteChapter(
          { url: url, chapterNumber: e.target.name },
          user,
          dispatch,
          loginSuccess
        )
        .then((res) => {
          getChapter();
          toast.success(res.message, {
            hideProgressBar: true,
            autoClose: 1000,
            pauseOnHover: false,
          });
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.details.message, {
            hideProgressBar: true,
            autoClose: 1000,
            pauseOnHover: false,
          });
        });
    }
  };

  const getChapter = useCallback(async () => {
    apiMain.getNameChapters(url, {}).then((res) => setChapters(res));
  });
  useEffect(() => {
    getChapter();
  }, []);

  const onClickAddChapter = (e) => {
    e.preventDefault();
    setAddChapter(true);
    setChapterNumber(null);
  };
  const onClickBackFromAddChap = useCallback(() => {
    setAddChapter(false);
  });
  return (
    <>
      {addChapter ? (
        <AddChapter
          url={url}
          chapnumber={chapterNumber}
          user={user}
          dispatch={dispatch}
          onClickBackFromAddChap={onClickBackFromAddChap}
          getChapters={getChapter}
        />
      ) : (
        <div>
          <div className="d-flex" style={{ justifyContent: "space-between" }}>
            <a onClick={onClickBackFromListChap}>
              <i className="fa-solid fa-angle-left"></i> Danh sách truyện
            </a>
            <span className="fs-20 fw-6">Danh sách chương</span>
            <button
              className="btn-primary"
              style={{ margin: "0px 10px" }}
              onClick={onClickAddChapter}
            >
              Thêm chương
            </button>
          </div>
          <Grid gap={15} col={2} snCol={1}>
            {chapters.map((item, index) => {
              return (
                <div key={item.chapnumber}>
                  <div className="d-flex">
                    <div
                      className="col-10 d-flex"
                      style={{ alignItems: "center" }}
                    >
                      <a
                        key={item.chapnumber}
                        name={item.chapnumber}
                        className="text-overflow-1-lines"
                      >
                        {item.tenchap}
                      </a>
                    </div>
                    <div className="col-2">
                      <a onClick={onClickUpdateChap} name={item.chapnumber}>
                        <i className="fa-solid fa-marker"></i> Sửa
                      </a>
                      <a onClick={onClickDeleteChap} name={item.chapnumber}>
                        <i className="fa-solid fa-trash"></i> Xoá
                      </a>
                    </div>
                  </div>
                  <hr />
                </div>
              );
            })}
          </Grid>
        </div>
      )}
    </>
  );
};

const AddChapter = ({
  url,
  chapnumber,
  user,
  onClickBackFromAddChap,
  getChapters,
}) => {
  const [tenchuong, setTenchuong] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();

  // Hàm xử lý chọn ảnh
  const handleFileChange = (e) => {
    setSelectedImages([...e.target.files]);
  };

  // Load dữ liệu khi sửa chương
  useEffect(() => {
    if (chapnumber) {
      apiMain.getChapterByNumber(url, chapnumber).then((res) => {
        setTenchuong(res.tenchap);
        setSelectedImages([]); // Xóa danh sách ảnh cũ, chỉ hiển thị ảnh đã tải lên từ API
        setEdit(true);
      });
    }
  }, [chapnumber, url]);

  // Hàm thêm chương
  const onClickAddChapter = async () => {
    if (!tenchuong) {
      toast.warning("Tên chương không được để trống.");
      return;
    }

    if (selectedImages.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một ảnh.");
      return;
    }

    try {
      dispatch(setLoading(true));

      // Chuẩn bị dữ liệu để gửi API
      const formData = new FormData();
      for (const image of selectedImages) {
        formData.append("files", image);
      }
      formData.append("tenchap", tenchuong);
      formData.append("url", url);

      // Gửi dữ liệu tới API
      if (edit) {
        await apiMain.updateChapter(chapnumber, formData, user);
        toast.success("Cập nhật chương thành công.");
      } else {
        await apiMain.createChapter(formData, user);
        toast.success("Thêm chương thành công.");
      }

      // Làm mới danh sách chương và quay lại
      getChapters();
      onClickBackFromAddChap();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi thêm/cập nhật chương, vui lòng thử lại.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <div className="d-flex" style={{ justifyContent: "space-between" }}>
        <a onClick={onClickBackFromAddChap}>
          <i className="fa-solid fa-angle-left"></i> Danh sách chương
        </a>
        <span className="fs-20 fw-6">{edit ? "Chỉnh sửa chương" : "Thêm chương"}</span>
      </div>

      <div>
        <label>Tên chương:</label>
        <input
          type="text"
          value={tenchuong}
          onChange={(e) => setTenchuong(e.target.value)}
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
          {edit ? "Cập nhật chương" : "Thêm chương"}
        </button>
      </div>
    </div>
  );
};

function EditNovel({ url, user, dispatch, onClickBackFromEditNovel }) {
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(avt);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [id, setId] = useState("");
  const loading = useSelector((state) => state.message.loading);
  const [loadingStory, setLoadingStory] = useState(true);
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
    "Trinh thám / Bí ẩn",
  ];

  useEffect(async () => {
    if (url) {
      apiMain.getComic({ url }).then((res) => {
        setPreview(res.image);
        setName(res.name);
        setDescription(res.description);
        setGenre(res.genre);
        setArtist(res.artist);
        setId(res.id);
        setLoadingStory(false);
      });
    }
  }, []);

  const handleEditNovel = async (data) => {
    try {
      apiMain
        .updateNovel(data, user, dispatch, loginSuccess)
        .then((res) => {
          console.log(res);
          toast.success("Sửa truyện thành công", {
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: false,
          });
          dispatch(setLoading(false));
        })
        .catch((err) => {
          console.log(err);
          dispatch(setLoading(false));
          toast.error(err.response?.details.message, {
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: false,
          });
        });
    } catch (error) {
      console.log(error);
      toast.error("Lỗi cập nhật thông tin", {
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: false,
      });
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

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
          await handleEditNovel(data);
        });
      });
    } else if (preview) {
      // Use the existing image preview if no new image is provided
      data.image = preview;
      await handleEditNovel(data);
    } else {
      // Handle cases where no image is provided
      await handleEditNovel(data);
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
          <a onClick={onClickBackFromEditNovel}>
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
                    <label for="types">Thể loại</label>
                    <select
                      style={labelStyle}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setGenre(e.target.value);
                      }}
                      value={genre}
                      id="types"
                      name="types"
                    >
                      {types.map((item) => {
                        return <option value={item}>{item}</option>;
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

export default TuTruyen;
