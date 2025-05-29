// src/components/Header/component/Diamond.jsx
import React, { useState, useRef, useEffect } from 'react';
import './styles.scss';
import { useSelector } from 'react-redux';
import diamondAnimation from '../../../../assets/lottie/diamond.json';
import Lottie from 'lottie-react';
import { routeLink } from '../../../../routes/AppRoutes';
import { useNavigate } from 'react-router-dom';

export default function Diamond() {
    const navigate = useNavigate();
    const [popoverVisible, setPopoverVisible] = useState(false);
    const popoverRef = useRef(null);
    const userStats = useSelector(state => state.userStats.data);
    const diamond = userStats?.diamond || 0;

    const togglePopover = (e) => {
        e.stopPropagation();
        setPopoverVisible(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target)) {
                setPopoverVisible(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleNavigate = () => {
        navigate(routeLink.diamondTopup);
        setPopoverVisible(false);
    }

    return (
        <div className="diamond-container" ref={popoverRef}>
            <div className="diamond-display" onClick={togglePopover}>
                <Lottie animationData={diamondAnimation} loop={true} className="diamond-animation" />
                <span className="diamond-count">{diamond}</span>
            </div>
            {popoverVisible && (
                <div className="diamond-popover">
                    <ul>
                        <li>
                            <button className="diamond-popover-btn">
                                <span role="img" aria-label="ad">🎬</span> Xem quảng cáo để nhận kim cương
                            </button>
                        </li>
                        <li>
                            <button className="diamond-popover-btn"
                                onClick={handleNavigate}>
                                <span role="img" aria-label="topup">💎</span> Nạp kim cương
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
