import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.scss';
import { routeLink } from '../../routes/AppRoutes';

export default function Chapter({ chapter, isActive }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(routeLink.chapterDetail.replace(':comicId', chapter?.comicId).replace(':chapterNumber', chapter?.chapterNumber));
    };

    return (
        <div
            className={`chapter-card ${isActive ? 'active' : ''}`}
            onClick={handleClick}
        >
            <div className="chapter-card__cover">
                <img src={chapter.imageUrl} alt="Chapter Cover" />
            </div>
            <div className="chapter-card__info">
                <h3 className="chapter-card__title">{chapter.name}</h3>
                <p className="chapter-card__date">{chapter.updatedAt}</p>
            </div>
        </div>
    );
}
