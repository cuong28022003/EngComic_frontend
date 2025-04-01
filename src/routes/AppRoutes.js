import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../views/Home";
import ComicDetail from "../views/ComicDetail";
import NotFound from "../views/404";
import MainLayout from "../layout/MainLayout/index_test";
import PrivateRoute from "./PrivateRoute";
import Account from "../views/Account/Account";
import Admin from "../views/Account/Admin";
import Active from "../views/Active/Active";
import ChapterDetail from "../views/ChapterDetail";
import Search from "../views/Search/Search";
import ComicList from "../views/ComicList";
import CreateComic from "../views/Account/CreateComic";
import Profile from "../views/Account/Profile/Profile";
import EditComic from "../views/Account/Bookshelf/tab/CreatedTab/EditComic";
import ChapterList from "../views/ChapterList";
import CreateChapter from "../views/ChapterList/CreateChapter";
import Bookshelf from "../views/Account/Bookshelf";
import ChangePassword from "../views/Account/ChangePassword";
import ReadingTab from "../views/Account/Bookshelf/tab/ReadingTab";
import CreatedTab from "../views/Account/Bookshelf/tab/CreatedTab";
import SavedTab from "../views/Account/Bookshelf/tab/SavedTab";

export const routeLink = {
    default: '/',
    users: '/users',
    myProfile: '/users/me',
    
    account: '/user',
    bookshelf: '/user/bookshelf/:bookshelfTab',
    profile: '/user/profile',
    changePassword: '/user/change-password',
    createComic: '/user/create-comic',

    userDetail: '/users/:id',
    comics: '/comics',
    editComic: '/comics/edit/:url',
    comicDetail: '/comics/:url',
    chapters: '/comics/:url/chapters',
    chapterDetail: '/comics/:url/chapters/:chapterNumber',
    createChapter: '/comics/:url/chapters/create',
    login: '/login',
    register: '/register',
    favorites: '/favorites',
    search: '/search',
};

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route path={routeLink.default} element={<Home />} />
                    <Route path={routeLink.comicDetail} element={<ComicDetail />} />
                    <Route path={routeLink.comics} element={<ComicList />} />
                    <Route path={routeLink.chapterDetail} element={<ChapterDetail />} />

                    <Route element={<PrivateRoute roles={['USER']} />}>
                        <Route path={routeLink.account} element={<Account />} >
                            <Route index element={<ChangePassword />} />
                            <Route path='profile' element={<Profile />} />
                            <Route path='change-password' element={<ChangePassword />} />
                            <Route path='bookshelf' element={<Bookshelf />} >
                                <Route index element={<ReadingTab />} />
                                <Route path='reading' element={<ReadingTab />} />
                                <Route path='saved' element={<SavedTab />} />
                                <Route path='created' element={<CreatedTab />} />
                            </Route>
                            <Route path='bookshelf/:bookshelfTab' element={<Bookshelf />} />
                            <Route path='create-comic' element={<CreateComic />} />
                        </Route>
                        {/* <Route path={routeLink.createComic} element={<CreateComic />} /> */}
                        <Route path={routeLink.editComic} element={<EditComic />} />
                        <Route path={routeLink.chapters} element={<ChapterList />} />
                        <Route path={routeLink.createChapter} element={<CreateChapter />} />
                    </Route>

                    <Route element={<PrivateRoute roles={['ADMIN']} />}>
                        <Route path='admin/*' element={<Admin />} />
                    </Route>
                    <Route path='active/:token' element={<Active />} />
                    <Route path='search' element={<Search />} />
                    <Route path={routeLink.comics} element={<ComicList />} />

                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
