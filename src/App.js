import './App.scss';
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AppRoutes />
    // <HashRouter>
    //   <Header />
    //   <Routes>
    //     <Route path='/' element={<Home />} />
    //     <Route path='comics/:url' element={<ComicDetail />} />
    //     <Route element={<PrivateRoute roles={['USER']} />}>
    //       <Route path='/user/*' element={<Account />} />
    //     </Route>
    //     <Route element={<PrivateRoute roles={['ADMIN']} />}>
    //       <Route path='admin/*' element={<Admin />} />
    //     </Route>
    //     <Route path='active/:token' element={<Active />} />
    //     <Route path='truyen/:url/:chapnum' element={<Chapter />} />
    //     <Route path='search' element={<Search />} />
    //     <Route path='comic-list' element={<ComicList />} />
    //   </Routes>
    //   <ToastContainer autoClose={1000}
    //     hideProgressBar
    //     newestOnTop={false}
    //     closeOnClick
    //     pauseOnFocusLoss
    //     pauseOnHover={false} />
    // </HashRouter>
  );
}

export default App;
