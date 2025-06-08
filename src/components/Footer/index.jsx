import React from "react";
import "./styles.scss";
import { FaFacebook, FaDiscord, FaGithub } from "react-icons/fa";
import logo from "../../assets/image/logo.png";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__section footer__logo">
                    <img
                        src={logo}// Đường dẫn tới ảnh logo, thay đổi nếu cần
                        alt="EngComic Logo"
                        className="footer__logo-img"
                    />
                    <h2>EngComic</h2>
                    <p>Trang web đọc truyện tranh online miễn phí, cập nhật liên tục.</p>
                </div>

                <div className="footer__section">
                    <h4>Thể loại</h4>
                    <ul>
                        <li>Hành động</li>
                        <li>Lãng mạn</li>
                        <li>Kinh dị</li>
                        <li>Hài hước</li>
                    </ul>
                </div>

                <div className="footer__section">
                    <h4>Liên kết</h4>
                    <ul>
                        <li>Trang chủ</li>
                        <li>Thư viện</li>
                        <li>BXH</li>
                        <li>Liên hệ</li>
                    </ul>
                </div>

                <div className="footer__section footer__socials">
                    <h4>Kết nối</h4>
                    <div className="footer__icons">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">
                            <FaFacebook />
                        </a>
                        <a href="https://discord.com" target="_blank" rel="noreferrer">
                            <FaDiscord />
                        </a>
                        <a href="https://github.com" target="_blank" rel="noreferrer">
                            <FaGithub />
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer__bottom">
                <p>© {new Date().getFullYear()} TruyenHub. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
