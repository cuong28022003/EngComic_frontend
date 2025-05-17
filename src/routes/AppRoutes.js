import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../views/Home";
import ComicDetail from "../views/ComicDetail";
import NotFound from "../views/404";
import MainLayout from "../layout/MainLayout";
import PrivateRoute from "./PrivateRoute";
import Account from "../views/Account/Account";
import Admin from "../views/Account/Admin";
import Active from "../views/Active/Active";
import ChapterDetail from "../views/ChapterDetail";
import SearchPage from "../views/Search";
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
import StudyPage from "../views/Study";
import ResultPage from "../views/Result";
import DeckPage from "../views/Deck";
import { createDeck } from "../api/deckApi";
import CreateDeckPage from "../views/CreateDeck";
import DeckFormPage from "../views/Deck/component/AddEditDeck";
import DeckDetailPage from "../views/DeckDetail";
import CardFormPage from "../views/DeckDetail/component/AddEditCard";
import Rank from "../views/Account/Rank";
import GachaPage from "../views/Gacha";
import GachaCollection from "../views/Account/Collection";

export const routeLink = {
    default: '/',
    users: '/users',
    myProfile: '/users/me',

    account: '/user',
    userAccount: '/user/:userId',   
    userCollection: '/user/gacha-collection',
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

    study: '/study/:deckId',
    result: '/result/:deckId',
    deck: '/deck',
    createDeck: '/deck/create',
    editDeck: '/deck/:deckId/edit',
    deckDetail: '/deck/:deckId',
    createCard: '/deck/:deckId/create-card',
    editCard: '/deck/:deckId/edit-card/:cardId',

    gacha: '/gacha',
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
                            <Route index element={<Profile />} />
                            <Route path='profile' element={<Profile />} />
                            <Route path='change-password' element={<ChangePassword />} />
                            <Route path='bookshelf' element={<Bookshelf />} />
                            <Route path='create-comic' element={<CreateComic />} />
                            <Route path='rank' element={<Rank />} />
                            <Route path='collection' element={<GachaCollection />} />
                        </Route>
                        <Route path={routeLink.editComic} element={<EditComic />} />
                        <Route path={routeLink.chapters} element={<ChapterList />} />
                        <Route path={routeLink.createChapter} element={<CreateChapter />} />

                        <Route path={routeLink.study} element={<StudyPage />} />
                        <Route path={routeLink.result} element={<ResultPage />} />
                        <Route path={routeLink.deck} element={<DeckPage />} />
                        <Route path={routeLink.createDeck} element={<DeckFormPage />} />
                        <Route path={routeLink.editDeck} element={<DeckFormPage />} />

                        <Route path={routeLink.deckDetail} element={<DeckDetailPage />} />
                        <Route path={routeLink.createCard} element={<CardFormPage />} />
                        <Route path={routeLink.editCard} element={<CardFormPage />} />
                        <Route path={routeLink.userAccount} element={<Account />}>
                            <Route index element={<Profile />} />
                            <Route path='profile' element={<Profile />} />
                            <Route path='bookshelf' element={<Bookshelf />} />
                            <Route path='rank' element={<Rank />} />
                        </Route>

                        <Route path={routeLink.gacha} element={<GachaPage />} />
                        <Route path={routeLink.userCollection} element={<GachaCollection />} />
                    </Route>
                </Route>
                    <Route path='active/:token' element={<Active />} />
                    <Route path='search' element={<SearchPage />} />
                    <Route path={routeLink.comics} element={<ComicList />} />
                <Route element={<PrivateRoute roles={['ADMIN']} />}>
                    <Route path='admin/*' element={<Admin />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;