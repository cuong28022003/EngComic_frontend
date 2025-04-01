
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { routeLink } from '../../routes/AppRoutes'
function Reading(props) {
  const reading=props.data
  const location = useLocation()
  const navigate = useNavigate()
  console.log(navigate)
const onClickComic=(e)=>{//xử lý click vào tên truyện để đọc
  navigate(routeLink.comicDetail.replace(":url", reading.url))//điều hướng web
}

  return (
    <div className="reading-card">
      <div className="reading-card__img-wrap">
        <img src={reading.image} alt="" />
      </div>
      <div className="reading-card__content">
        <a onClick={onClickComic} name={reading?.url} className="reading-card__title">
          {reading.name}
        </a>
        <div className="reading-card__chap">
          Đã đọc: {reading.chapterNumber}/{reading?.chapterCount}
        </div>
      </div>
    </div>
  ) 
}

export default Reading