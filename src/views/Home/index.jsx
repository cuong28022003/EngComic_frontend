import React, { useEffect, useState } from "react";
import "./styles.scss";
import { getComics } from "../../api/comicApi";
import ComicCard from "../../components/ComicCard";
import { getLeaderboard } from "../../api/userStatsApi";
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import { routeLink } from "../../routes/AppRoutes";

const demoHotComics = [
    {
        id: 1,
        title: "One Piece",
        background: "/images/onepiece.jpg",
    },
    {
        id: 2,
        title: "Attack on Titan",
        background: "/images/aot.jpg",
    },
    {
        id: 3,
        title: "Jujutsu Kaisen",
        background: "/images/jujutsu.jpg",
    },
];

const demoRecentComics = [
    { id: 1, title: "One Piece", cover: "/images/onepiece.jpg", updatedAt: "5 phút trước" },
    { id: 2, title: "Naruto", cover: "/images/naruto.jpg", updatedAt: "10 phút trước" },
    { id: 3, title: "Bleach", cover: "/images/bleach.jpg", updatedAt: "30 phút trước" },
    { id: 4, title: "Chainsaw Man", cover: "/images/chainsaw.jpg", updatedAt: "1 giờ trước" },
];

const demoTopUsers = [
    { id: 1, name: "OtakuKing", avatar: "/images/user1.png", readCount: 320 },
    { id: 2, name: "MangaGirl", avatar: "/images/user2.png", readCount: 290 },
    { id: 3, name: "ComicHunter", avatar: "/images/user3.png", readCount: 240 },
];

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hotComics, setHotComics] = useState([] || demoHotComics);
    const [recentComics, setRecentComics] = useState([] || demoRecentComics);
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const params = {
            page: 0,
            size: 5,
        }
        getLeaderboard(params)
            .then(res => setTopUsers(res.data.content))
            .catch(err => console.error(err));
    }, []);

    async function fetchHotComics() {
        try {
            setLoading(true);
            const params = {
                page: 0,
                size: 4,
                sort: "views",
                order: "desc",
            }
            const response = await getComics(params);
            const data = response.data.content;
            setHotComics(data);
            // console.log("Hot comics fetched:", data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch hot comics:", error);
            setLoading(false);
            setRecentComics([]);
        }
    }

    async function fetchRecentComics() {
        try {
            setLoading(true);
            const params = {
                page: 0,
                size: 10,
                sort: "updatedAt",
                order: "desc",
            }
            const response = await getComics(params);
            const data = response.data.content;
            setRecentComics(data);
            // console.log("Recent comics fetched:", data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch recent comics:", error);
            setLoading(false);
            setRecentComics([]);
        }
    }
    useEffect(() => {
        fetchHotComics();
        fetchRecentComics();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % demoHotComics.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="home-page">
            <div className="hero-slider">
                {hotComics.map((comic, index) => (
                    <div
                        key={comic.id}
                        className={`slide ${index === currentSlide ? "active" : ""}`}
                        style={{ backgroundImage: `url(${comic.backgroundUrl})` }}
                    >
                        <div className="overlay" />
                        <h2>{comic.name}</h2>
                    </div>
                ))}
                <div className="slider-controls">
                    {hotComics.map((_, index) => (
                        <span
                            key={index}
                            className={index === currentSlide ? "dot active" : "dot"}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </div>

            <div className="main-content">
                <div className="left">
                    <h3>Truyện mới cập nhật</h3>
                    <div className="comic-list">
                        {recentComics.map((comic) => (
                            <ComicCard comic={comic} key={comic.id} />
                        ))}
                    </div>
                    <button
                        className="button-primary load-more"
                        onClick={() => navigate(routeLink.search)}
                    >Xem thêm</button>
                </div>

                <div className="right">
                    <h3>Top độc giả</h3>
                    <div className="ranking-list">
                        {topUsers.map((user, idx) => (
                            <div
                                className="user-item"
                                key={user.user.id}
                                onClick={() => navigate(routeLink.userAccount.replace(":userId", user.user.id))}
                            >
                                <span className="rank">#{idx + 1}</span>
                                <img
                                    src={user?.userStats?.rank?.badge}
                                    alt={user?.userStats?.rank?.name}
                                />
                                <div className="info">
                                    <p>{user.user.fullName}</p>
                                    <span className="xp">{user?.userStats?.xp} XP</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
