import './App.scss';
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
    <AppRoutes />
      <ToastContainer autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover={false} /> 
    </>
  );
}

export default App;
