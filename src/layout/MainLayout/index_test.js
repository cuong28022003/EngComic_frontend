import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';

function MainLayout() {
    return (
        <div className="main-layout">
            {/* Header */}
            <Header />

            {/* Nội dung thay đổi dựa trên route */}
            <main>
                <Outlet />
            </main>

            {/* Footer */}
            <footer>
                <p>© 2025 EngComic. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default MainLayout;
