import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../views/HomeOld";
import ComicDetail from "../views/ComicDetail";
import NotFound from "../views/404";
import MainLayout from "../layout/MainLayout";
import PrivateRoute from "./PrivateRoute";
import Account from "../views/Account/Account";
import Admin from "../views/Admin";
import Active from "../views/Active/Active";
import ChapterDetail from "../views/ChapterDetail";
import SearchPage from "../views/Search";
import ComicList from "../views/ComicList";
import CreateAndEditComicPage from "../views/CreateAndEditComic";
import Profile from "../views/Account/Profile/Profile";
import ChapterList from "../views/ChapterList";
import Bookshelf from "../views/Account/Bookshelf";
import ChangePassword from "../views/Account/ChangePassword";
import ReadingTab from "../views/Account/Bookshelf/tab/ReadingTab";
import CreatedTab from "../views/Account/Bookshelf/tab/CreatedTab";
import SavedTab from "../views/Account/Bookshelf/tab/SavedTab";
import StudyPage from "../views/Study";
import ResultPage from "../views/Result";
import DeckPage from "../views/Deck";
import { createDeck } from "../api/deckApi";
import CreateDeckPage from "../views/CreateDeck";
import DeckFormModal from "../views/Deck/component/AddEditDeck";
import DeckDetailPage from "../views/DeckDetail";
import CardFormModal from "../views/DeckDetail/component/AddEditCard";
import Rank from "../views/Account/Rank";
import GachaPage from "../views/Gacha";
import GachaCollection from "../components/Collection";
import PremiumPage from "../views/Premium";
import DiamondTopupPage from "../views/DiamondTopup";
import TopupHistoryPage from "../views/Account/TopupHistory";
import ImagePage from "../views/ChapterDetail/component/imagePage";
import UserManagement from "../views/Admin/component/UserManagement";
import ComicManagement from "../views/Admin/component/ComicManagement";
import ReportManagement from "../views/Admin/component/ReportManagement";
import RankManagement from "../views/Admin/component/RankManagement/index.";
import TopupManagement from "../views/Admin/component/TopupManagement";
import CreateOrEditChapterPage from "../views/CreateOrEditChapterPage";
import HomePage from "../views/Home";
import LeaderboardPage from "../views/Leaderboard";

export const routeLink = {
    home: '/',
    users: '/users',
    myProfile: '/users/me',

    account: '/user',
    userAccount: '/user/:userId',
    collection: '/user/collection',
    createComic: '/user/create-comic',
    rank: '/user/rank',
    bookshelf: '/user/bookshelf',

    comics: '/comics',
    createComic: '/comics/create',
    editComic: '/comics/:comicId/edit',
    comicDetail: '/comics/:comicId',

    chapters: '/comics/:comicId/chapters',
    chapterDetail: '/comics/:comicId/chapters/:chapterNumber',
    createChapter: '/comics/:comicId/chapters/create',
    editChapter: '/comics/:comicId/chapters/:chapterId/edit',
    login: '/login',
    register: '/register',
    favorites: '/favorites',
    search: '/search',

    study: '/study/:deckId',
    result: '/result/:deckId',
    deck: '/deck',
    createDeck: '/deck/create',
    editDeck: '/deck/:deckId/edit',
    deckDetail: '/deck/:deckId',
    createCard: '/deck/:deckId/create-card',
    editCard: '/deck/:deckId/edit-card/:cardId',

    gacha: '/gacha',

    premium: '/upgrade-premium',
    diamondTopup: '/diamond-topup',
    topupHistory: '/topup-history',
    leaderboard: '/leaderboard',

    admin: '/admin',
};

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    {/* <Route path={routeLink.home} element={<Home />} /> */}
                    <Route path={routeLink.comicDetail} element={<ComicDetail />} />
                    <Route path={routeLink.comics} element={<ComicList />} />

                    <Route element={<PrivateRoute roles={['USER']} />}>
                        <Route path={routeLink.account} element={<Account />} >
                            <Route index element={<Profile />} />
                            <Route path='profile' element={<Profile />} />
                            <Route path='change-password' element={<ChangePassword />} />
                            <Route path='bookshelf' element={<Bookshelf />} />
                            <Route path='rank' element={<Rank />} />
                            <Route path='collection' element={<GachaCollection />} />
                        </Route>
                        <Route path={routeLink.chapters} element={<ChapterList />} />
                        {/* <Route path={routeLink.createChapter} element={<CreateChapter />} /> */}

                        <Route path={routeLink.study} element={<StudyPage />} />
                        <Route path={routeLink.result} element={<ResultPage />} />
                        <Route path={routeLink.deck} element={<DeckPage />} />
                        <Route path={routeLink.createDeck} element={<DeckFormModal />} />
                        <Route path={routeLink.editDeck} element={<DeckFormModal />} />

                        <Route path={routeLink.deckDetail} element={<DeckDetailPage />} />
                        <Route path={routeLink.createCard} element={<CardFormModal />} />
                        <Route path={routeLink.editCard} element={<CardFormModal />} />
                        <Route path={routeLink.userAccount} element={<Account />}>
                            <Route index element={<Profile />} />
                            <Route path='profile' element={<Profile />} />
                            <Route path='bookshelf' element={<Bookshelf />} />
                            <Route path='rank' element={<Rank />} />
                            <Route path='collection' element={<GachaCollection />} />
                        </Route>

                        <Route path={routeLink.gacha} element={<GachaPage />} />
                        <Route path={routeLink.premium} element={<PremiumPage />} />
                        <Route path={routeLink.diamondTopup} element={<DiamondTopupPage />} />
                        <Route path={routeLink.topupHistory} element={<TopupHistoryPage />} />

                        <Route path={routeLink.createComic} element={<CreateAndEditComicPage />} />
                        <Route path={routeLink.editComic} element={<CreateAndEditComicPage />} />
                        <Route path={routeLink.createChapter} element={<CreateOrEditChapterPage />} />
                        <Route path={routeLink.editChapter} element={<CreateOrEditChapterPage />} />


                        {/* <Route path="/snipping" element={<ImagePage />} /> */}

                    </Route>
                    <Route path={routeLink.search} element={<SearchPage />} />
                    <Route path={routeLink.home} element={<HomePage />} />
                    <Route path={routeLink.leaderboard} element={<LeaderboardPage />} />
                </Route>
                <Route path={routeLink.chapterDetail} element={<ChapterDetail />} />

                <Route path='active/:token' element={<Active />} />
                <Route path={routeLink.comics} element={<ComicList />} />
                <Route element={<PrivateRoute roles={['ADMIN']} />}>
                    <Route path={routeLink.admin} element={<Admin />} >
                        <Route index element={<UserManagement />} />
                        {/* <Route path="profile" element={<Profile userInfo={userInfo} />} />
                        <Route path="change-password" element={<ChangePassword />} /> */}
                        <Route path="users" element={<UserManagement />} />
                        <Route path="comics" element={<ComicManagement />} />
                        <Route path="reports" element={<ReportManagement />} />
                        <Route path="ranks" element={<RankManagement />} />
                        <Route path="topups" element={<TopupManagement />} />
                        {/* <Route path="delete-truyen" element={<ComicList dispatch={dispatch} />} /> */}
                        {/* <Route path="tu-truyen/*" element={<Bookshelf userInfo={userInfo} />} /> */}
                        {/* <Route path="rank" element={<AdminRank />} />
                        <Route path="report" element={<ReportList />} />
                        <Route path="dang-truyen" element={<CreateComic userInfo={userInfo} />} /> */}
                    </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;