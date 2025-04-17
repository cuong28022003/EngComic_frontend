import React, { useCallback, useEffect, useState } from 'react'
import { useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/img/logo.png';
import Auth from '../Auth';
import Modal, { ModalContent } from '../modal';
import { authLoginActive, authRegisterActive, authInactive } from '../../redux/modalSlice';
import { handleLogout } from '../../handle/handleAuth';
import { setQuery } from '../../redux/messageSlice';
import { routeLink } from '../../routes/AppRoutes';
import './styles.scss'
import { ComicGenres } from '../../constant/enum';

const genres = [
    { title: "Hành động", href: "/the-loai/hanh-dong" },
    { title: "Phiêu lưu", href: "/the-loai/phieu-luu" },
    { title: "Hài hước", href: "/the-loai/hai-huoc" },
    { title: "Siêu nhiên", href: "/the-loai/kinh-di" },
    { title: "Thể thao", href: "/the-loai/kinh-di" },
    { title: "Giả tưởng", href: "/the-loai/kinh-di" },
    { title: "Mecha", href: "/the-loai/kinh-di" },
    { title: "Khoa học viễn tưởng", href: "/the-loai/kinh-di" },
    { title: "Tâm lý / Kịch tính", href: "/the-loai/kinh-di" },
    { title: "Trinh thám / Bí ẩn", href: "/the-loai/kinh-di" },
];

export default function Header() {
    const headerRef = useRef(null)
    const expandRef = useRef(null)
    const profileDropdownRef = useRef(null)
    const user = useSelector(state => state.auth.login?.user);
    const modalAuth = useSelector(state => state.modal.auth.active);
    const modalLogin = useSelector(state => state.modal.auth.login);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const menuItems = [
        { name: "Hồ sơ", path: "/user/profile" },
        { name: "Đổi mật khẩu", path: "/user/change-password" },
        { name: "Tủ truyện", path: "/user/bookshelf" },
        { name: "Quản lý thẻ", path: routeLink.deck },
    ];

    if (user?.roles[0] === 'ADMIN') {
        menuItems.push(
            { name: "Người dùng", path: "/admin/users" },
            { name: "Cài đặt", path: "/admin/setting" },
        );
    }

    let location = useLocation();

    const dispatch = useDispatch();

    useEffect(() => {//xử lý dropdown của account
        const hideDropdown = () => {
            profileDropdownRef?.current?.classList.remove("active")
        }
        document.addEventListener("click", hideDropdown)
        return () => {
            document.removeEventListener("click", hideDropdown)
        }
    }, [])

    const handleExpand = () => {
        expandRef.current.classList.toggle('active')
    }

    const handleDropdownProfile = (e) => {
        e.stopPropagation();
        profileDropdownRef?.current.classList.toggle('active')
    }

    const hideProfileDropdown = () => {
        profileDropdownRef?.current.classList.remove('active')
    }

    const closeModalAuth = useCallback(() => {
        dispatch(authInactive());
    });

    const handleAuthLogin = () => {
        dispatch(authLoginActive());
    }

    const handleAuthRegister = () => {
        dispatch(authRegisterActive());
    }

    const onClickLogout = () => {
        handleLogout(dispatch, navigate, location)
    }

    const onClickSearch = () => {
        if (navigate.pathname != '/search') {
            navigate(`/search?keyword=${search}`)
        }
    }
    return (
        <>
            <nav ref={headerRef} className="header">
                <div className="header__wrap">

                    <div className="logo">
                        <Link className="" to='/'><img src={logo} alt="" /></Link>
                    </div>
                    <div className="navbar-nav">

                        <ul className='navbar-nav__list'>
                            <div className="navigation-menu">
                                <div
                                    className="navigation-trigger"
                                    onMouseEnter={() => setDropdownVisible(true)}
                                    onMouseLeave={() => setDropdownVisible(false)}
                                >
                                    <span className="text-bold">Thể loại</span>
                                    <ul className={`navigation-dropdown ${dropdownVisible ? "active" : ""}`}>
                                        {/* {genres.map((genre, index) => (
                                            <li key={index}>
                                                <Link to={`/search?genre=${genre.title}`}>{genre.title}</Link>
                                            </li>
                                        ))} */}
                                        {ComicGenres.map((genre, index) => (
                                            <li key={index}>
                                                <Link to={`/search?genre=${genre}`}>{genre}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <Link to='/truyen'>
                                <li className='text-bold'>Bảng xếp hạng</li>
                            </Link>
                        </ul>
                        <div className='navbar-nav__list__search'>
                            <div className='form-group'>
                                <input placeholder='Tìm truyện' onChange={e => { setSearch(e.target.value); console.log(e.target.value) }} value={search} onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onClickSearch(); // Gọi hàm tìm kiếm khi nhấn Enter
                                    }
                                }}></input>
                                <button onClick={onClickSearch}><i className="fa-solid fa-magnifying-glass"></i></button>
                            </div>
                        </div>
                        <ul className='navbar-nav__list navbar-nav__list--right'>
                            <Link to={user?.roles[0] === 'ADMIN' ? '/admin/dang-truyen' : routeLink.createComic}>
                                <li><i style={{ marginRight: 4 + 'px' }} className="fa-regular fa-circle-up"></i> Đăng truyện</li>
                            </Link>
                            {
                                user ? <div className='navbar-nav__profile'>
                                    <div onClick={handleDropdownProfile} className="navbar-nav__profile__name">
                                        {user.image ?
                                            <div className='navbar-nav__avatar'><img src={user.image} alt="" /></div>
                                            : <i style={{ marginRight: 4 + 'px' }} className="fa-solid fa-user"></i>
                                        }
                                        <a>{user.fullName || user.username}</a>
                                    </div>
                                    <div ref={profileDropdownRef} tabIndex={"1"} onBlur={hideProfileDropdown} className="navbar-nav__profile__menu">
                                        <ul>
                                            {menuItems.map((item, i) => {
                                                return <li key={i}><Link to={item.path}>{item.name}</Link></li>
                                            })}
                                            <li ><a onClick={onClickLogout}>Đăng xuất</a></li>
                                        </ul>
                                    </div>
                                </div>
                                    :
                                    <>
                                        <a onClick={handleAuthLogin}><li>Đăng nhập</li></a>
                                        <a onClick={handleAuthRegister}><li>Đăng ký</li></a>
                                    </>
                            }
                        </ul>
                    </div>
                </div>

            </nav>

            {modalAuth && <Modal active={modalAuth}>
                <ModalContent onClose={closeModalAuth}>
                    <Auth choose={modalLogin} />
                </ModalContent>
            </Modal>}
        </>
    )
}
