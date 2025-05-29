import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import { ToastContainer } from "react-toastify";
import "./styles.scss"

const MainLayout = () => {
    return (
        <>  
            <Header />
            <main className="main">
                <div className="container">
                    <Outlet /> {/* Render nội dung theo route */}
                </div>
            </main>

        </>
    );
};

export default MainLayout;
