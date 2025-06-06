import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles.scss';

export default function HeroSlider({ comics }) {
    const navigate = useNavigate();

    return (
        <div className="hero-slider">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000 }}
                loop
            >
                {comics.map((comic, idx) => (
                    <SwiperSlide key={idx}>
                        <div className="hero-slider__item">
                            <div
                                className="hero-slider__item__left"
                                onClick={() => navigate(`/comic/${comic.id}`)}
                            >
                                <img src={comic.images[0]} alt="cover" />
                            </div>
                            <div className="hero-slider__item__right">
                                {comic.images.slice(1, 5).map((page, i) => (
                                    <div
                                        key={i}
                                        className="hero-slider__item__right__img"
                                        onClick={() => navigate(`/comic/${comic.id}`)}
                                    >
                                        <img src={page} alt={`page-${i}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
