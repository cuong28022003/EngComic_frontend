// import { createBrowserRouter, RouteObject } from 'react-router-dom';
// import MainLayout from './layout/MainLayout/index';
// import AuthLayout from './layout/AuthLayout';
// import NotFound from './views/404';
// import Home from './views/Home/index';
// import ComicList from './views/ComicList';
// import ComicDetail from './views/ComicDetail';
// // import ChapterDetail from './views/ChapterDetail';
// import LoginPage from './views/Login';
// import RegisterPage from './views/Register';
// import Account from './views/Account/Account';
// // import Favorites from './views/Favorites';
// // import SearchResults from './views/SearchResults';

// export const routeLink = {
//     default: '/',
//     comics: '/comics',
//     comicDetail: '/comics/:id',
//     chapterDetail: '/comics/:comicId/chapter/:chapterId',
//     login: '/login',
//     register: '/register',
//     profile: '/profile',
//     favorites: '/favorites',
//     search: '/search',
// };

// const createAppRoutes = (routes) => {
//     return createBrowserRouter([
//         ...routes,
//         { path: '*', element: <NotFound /> } // Di chuyển vào bên trong mảng chính
//     ]);
// };


// export const userRoutes = createAppRoutes([
//     {
//         path: routeLink.default,
//         element: <MainLayout />,
//         children: [
//             { path: routeLink.default, element: <Home /> },
//             { path: routeLink.comics, element: <ComicList /> },
//             { path: routeLink.comicDetail, element: <ComicDetail /> },
//             // { path: routeLink.chapterDetail, element: <ChapterDetail /> },
//             { path: routeLink.profile, element: <Account /> },
//             // { path: routeLink.favorites, element: <Favorites /> },
//             // { path: routeLink.search, element: <SearchResults /> },
//         ],
//     },
//     {
//         path: routeLink.login,
//         element: <AuthLayout />,
//         children: [
//             { path: routeLink.login, element: <LoginPage /> },
//             { path: routeLink.register, element: <RegisterPage /> },
//         ],
//     },
// ]);
