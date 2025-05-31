import React, { useCallback, useEffect, useState } from 'react'
import { useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/image/logo.png';
import Auth from '../Auth/index';
import Modal, { ModalContent } from '../modal';
import { authLoginActive, authRegisterActive, authInactive } from '../../redux/modalSlice';
import { handleLogout } from '../../handle/handleAuth';
import { routeLink } from '../../routes/AppRoutes';
import './styles.scss'
import { ComicGenres } from '../../constant/enum';
import { getUserStats } from '../../api/userStatsApi';
import { loginSuccess } from '../../redux/slice/auth';
import StreakRewards from './component/Streak';
import { updateUserStats } from '../../redux/slice/userStats';
import Diamond from './component/Diamond';
import Avatar from '../Avatar';
import defaultAvatar from '../../assets/image/avt.png';

export default function Header() {
    const headerRef = useRef(null)
    const expandRef = useRef(null)
    const profileDropdownRef = useRef(null)
    const user = useSelector(state => state.auth.login?.user);
    const userStats = useSelector(state => state.userStats.data);
    const modalAuth = useSelector(state => state.modal.auth.active);
    const modalLogin = useSelector(state => state.modal.auth.login);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoryPopupVisible, setCategoryPopupVisible] = useState(false);

    const menuItems = [
        { name: "Hồ sơ", path: "/user/profile" },
        { name: "Đổi mật khẩu", path: "/user/change-password" },
        { name: "Tủ truyện", path: "/user/bookshelf" },
        { name: "Quản lý thẻ", path: routeLink.deck },
        { name: "Xếp hạng", path: routeLink.rank },
    ];



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

    const toggleMobileMenuOpen = () => {
        setMobileMenuOpen(prev => !prev)
    }

    const toggleCategoryPopup = () => {
        setMobileMenuOpen(false);
        setCategoryPopupVisible(prev => !prev);
    }

    return (
        <>
            <nav ref={headerRef} className="header">
                <div className="header__wrap">

                    <div className="logo">
                        <Link className="" to='/'><img src={logo} alt="" /></Link>
                    </div>

                    <div className="collapse">
                        <button onClick={toggleMobileMenuOpen} className={mobileMenuOpen ? 'active' : ''}>
                            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                        </button>
                    </div>

                    <div className="navbar-nav">

                        <ul className='navbar-nav__list'>
                            <a className="text-bold" onClick={toggleCategoryPopup}>Thể loại</a>

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
                            <Link to={routeLink.gacha}>
                                <li className="gacha-btn">
                                    <i className="fa-solid fa-dice-d20"></i> Gacha
                                </li>
                            </Link>
                            <Link to={routeLink.premium}>
                                <li className="premium-btn"><i className="fa-solid fa-crown"></i> Premium</li>
                            </Link>

                            <Link to={routeLink.createComic}>
                                <li><i style={{ marginRight: 4 + 'px' }} className="fa-regular fa-circle-up"></i> Đăng truyện</li>
                            </Link>

                            {
                                user ?
                                    <>
                                        <StreakRewards />
                                        <Diamond />
                                        <div className='navbar-nav__profile'>
                                            <div onClick={handleDropdownProfile} className="navbar-nav__profile__name">
                                                <Avatar
                                                    src={user?.imageUrl || defaultAvatar}
                                                    userStats={userStats}
                                                    size={60}
                                                />

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
                                    </>
                                    :
                                    <>
                                        <a onClick={handleAuthLogin}><li>Đăng nhập</li></a>
                                        <a onClick={handleAuthRegister}><li>Đăng ký</li></a>
                                    </>
                            }
                        </ul>
                    </div>

                    <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
                        <ul>
                            <li><Link to="/search?genre=Action" onClick={toggleCategoryPopup}>Thể loại</Link></li>
                            <li><Link to="/truyen">Bảng xếp hạng</Link></li>
                            <li>
                                <Link to={routeLink.premium}><i className="fa-solid fa-crown"></i> Premium</Link>
                            </li>

                            <li><Link to={routeLink.createComic}>Đăng truyện</Link></li>
                            {user ? (
                                <>
                                    {menuItems.map((item, i) => (
                                        <li key={i}><Link to={item.path}>{item.name}</Link></li>
                                    ))}
                                    <li><a onClick={onClickLogout}>Đăng xuất</a></li>
                                </>
                            ) : (
                                <>
                                    <li><a onClick={handleAuthLogin}>Đăng nhập</a></li>
                                    <li><a onClick={handleAuthRegister}>Đăng ký</a></li>
                                </>
                            )}
                        </ul>
                    </div>

                </div>

            </nav>


            {/* Popup bảng thể loại */}
            {categoryPopupVisible && (
                <div className="category-popup">
                    <div className="popup-content">
                        <button className="close-btn" onClick={toggleCategoryPopup}><i class="fa-solid fa-xmark"></i></button>
                        <h2>Danh sách thể loại</h2>
                        <div className="category-list">
                            {ComicGenres.map((genre, index) => (
                                <div key={index} className="category-item">
                                    <Link to={`/search?genre=${genre}`} onClick={toggleCategoryPopup}>{genre}</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {modalAuth && <Modal active={modalAuth}>
                <ModalContent onClose={closeModalAuth}>
                    <Auth choose={modalLogin} />
                </ModalContent>
            </Modal>}
        </>
    )
}
