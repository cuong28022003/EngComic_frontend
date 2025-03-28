import { HashRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header/index';
import './App.scss';
import Home from './views/Home';
import Account from './views/Account/Account';
import Admin from './views/Account/Admin';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from './views/PrivateRoute';
import ComicDetail from './views/ComicDetail';
import Active from './views/Active/Active';
import Chapter from './views/Chapter/Chapter';
import Search from './views/Search/Search';
import ComicList from './views/ComicList/index';
import { userRoutes } from './Router';

function App() {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='comics/:url' element={<ComicDetail />} />
        <Route element={<PrivateRoute roles={['USER']} />}>
          <Route path='/user/*' element={<Account />} />
        </Route>
        <Route element={<PrivateRoute roles={['ADMIN']} />}>
          <Route path='admin/*' element={<Admin />} />
        </Route>
        <Route path='active/:token' element={<Active />} />
        <Route path='truyen/:url/:chapnum' element={<Chapter />} />
        <Route path='search' element={<Search />} />
        <Route path='comic-list' element={<ComicList />} />
      </Routes>
      <ToastContainer autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover={false} />
    </HashRouter>
  );
}

export default App;
