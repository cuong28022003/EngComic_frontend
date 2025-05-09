import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.scss';
import { routeLink } from '../../routes/AppRoutes';

export default function Chapter({ chapter }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(routeLink.chapterDetail.replace(':url', chapter.comic.url).replace(':chapterNumber', chapter.chapterNumber));
    };

    return (
        <div className="chapter-card" onClick={handleClick}>
            <div className="chapter-card__cover">
                <img src={chapter.cover} alt="Chapter Cover" />
            </div>
            <div className="chapter-card__info">
                <h3 className="chapter-card__title">{chapter.name}</h3>
                <p className="chapter-card__date">{chapter.updateAt}</p>
            </div>
        </div>
    );
}
