import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiMain from "../../../api/apiMain";
import { loginSuccess } from "../../../redux/slice/auth";
import Reading from "../../../components/Reading/Reading";
import Grid from "../../../components/Grid";
import {
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
  useParams,
  NavLink,
  Outlet,
} from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toast } from "react-toastify";
import getData from "../../../api/getData";
import avt from "../../../assets/img/avt.png";
import { storage } from "../../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setLoading } from "../../../redux/messageSlice";
import Loading from "../../../components/Loading/Loading";
import LoadingData from "../../../components/Loading/LoadingData";
import Saved from "../../../components/Saved";
import { getComicsByUsername } from "../../../api/comicApi";
import CreatedTab from "./tab/CreatedTab";
import ReadingTab from "./tab/ReadingTab";
import { routeLink } from "../../../routes/AppRoutes";
import "./styles.scss";

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
function Bookshelf({ userInfo }) {
  const user = useSelector((state) => state.auth.login.user);
  console.log(user);
  const dispatch = useDispatch();
  const location = useLocation();
  // const [tab, setTab] = useState("reading");
  const { bookshelfTab = "reading" } = useParams();
  console.log("bookshelftab: " + bookshelfTab);
  
  // const active = nav.findIndex(
  //   (e) => e.path === location.pathname.split("/").pop()
  // );

  return (
    <>
      <div className="navigate">
        {nav.map((item, index) => {
          return (
            <NavLink
              key={item.path}
              to={routeLink.bookshelf.replace(":bookshelfTab", item.path)}
              className={({isActive}) => `navigate__tab fs-16 bold ${isActive ? "tab_active" : ""}`}
              name={item.path}
            >
              {item.display}
              </NavLink>
          );
        })}
      </div>

      {/* {bookshelfTab === "reading" && <ReadingTab />}
      {bookshelfTab === "saved" && <Saveds />}
      {bookshelfTab === "created" && <CreatedTab />} */}

      <Outlet />

      {/* <Routes>
        <Route
          key={"reading"}
          path="reading"
          element={<ReadingTab key={"reading"} dispatch={dispatch} user={user} />}
        />
        <Route
          key={"saved"}
          path="saved"
          element={<Saveds key={"saved"} user={user} dispatch={dispatch} />}
        />
        <Route
          key={"created"}
          path="created"
          element={<CreatedTab key={"created"} userInfo={userInfo} />}
        />
      </Routes> */}
    </>
  );
}









export default Bookshelf;
