import React from "react";
import "./styles.scss";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { routeLink } from "../../routes/AppRoutes";

const ComicCard = ({ comic }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(routeLink.comicDetail.replace(":comicId", comic?.id));
  };

  return (
    <div className="comic-card" onClick={handleClick} >
      <div className="thumbnail-wrapper">
        <img src={comic?.imageUrl} alt={comic?.name} className="thumbnail" />
      </div>
      <div className="info">
        <h3 className="name">{comic?.name}</h3>
        {/* {comic?.artist && <p className="artist">Tác giả: {comic?.artist}</p>} */}
        <p className="genre">{comic?.genre}</p>
        <div className="views">
          <Eye size={16} className="icon" />
          <span>{comic?.views.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ComicCard;
