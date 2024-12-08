
import {Link, useLocation, useNavigate} from 'react-router-dom'
function Reading(props) {
  const data=props.data
  const location = useLocation()
  const navigate = useNavigate()
  console.log(navigate)
const onClickTruyen=(e)=>{//xử lý click vào tên truyện để đọc
  navigate('/truyen/'+e.target.name)//điều hướng web
}

  return (
    <div className="reading-card">
      <div className="reading-card__img-wrap">
        <img src={data.hinhanh} alt="" />
      </div>
      <div className="reading-card__content">
        <a onClick={onClickTruyen} name={data?.url} className="reading-card__title">
          {data.tentruyen}
        </a>
        <div className="reading-card__chap">
          Đã đọc: {data.chapnumber}/{data?.sochap}
        </div>
      </div>
    </div>
  )
}

export default Reading