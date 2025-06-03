
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { routeLink } from '../../routes/AppRoutes'
function Reading(props) {
  const reading=props.data
  const location = useLocation()
  const navigate = useNavigate()
  const comic = reading?.comic;
  console.log(navigate)
const onClickComic=(e)=>{//xử lý click vào tên truyện để đọc
  navigate(routeLink.comicDetail.replace(":comicId", comic?.id))//điều hướng web
}

  return (
    <div className="reading-card">
      <div className="reading-card__img-wrap">
        <img src={comic?.imageUrl} alt="" />
      </div>
      <div className="reading-card__content">
        <a onClick={onClickComic} name={comic?.id} className="reading-card__title">
          {comic?.name}
        </a>
        <div className="reading-card__chap">
          Đã đọc: {reading?.chapterNumber}/{comic?.totalChapters}
        </div>
      </div>
    </div>
  ) 
}

export default Reading