import { useEffect, useState } from "react";
import Reading from "../../components/Reading/Reading";
import Section, { SectionHeading, SectionBody } from "../../components/section";
import Comic from "../../components/ComicCard";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loginSuccess } from "../../redux/slice/auth";
import "./ListStory.scss";
import { getComics } from "../../api/comicApi";
import NoData from "../../components/NoData";
import { getReadingsByUserId } from "../../api/readingApi";
import { routeLink } from "../../routes/AppRoutes";
import HeroSlider from "../Home/component/HeroSlider";
import ComicCard from "../../components/ComicCard";

function ListStory() {
  const [datas, setData] = useState([]);
  const [readings, setReadings] = useState([]);
  const user = useSelector((state) => state.auth.login.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const getReadingList = async () => {
      if (user) {
        const params = {
          page: 0,
          size: 10, // Số lượng truyện mỗi trang
        }
        getReadingsByUserId(params, user, dispatch, loginSuccess)
          .then((res) => {
            setReadings(res.data.content);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    getReadingList();
  }, [user, dispatch]);

  useEffect(() => {
    const getStory = async () => {
      const res = await getComics({ size: 6 });
      setData(res.content);
    };
    getStory();
  }, []);

  return (
    <>
      {/* <HeroSlider topComics={datas} /> */}
      <div className="d-flex">
        <div className="col-8">
          <Section>
            <SectionHeading>
              <h4 className="section-title">Biên tập viên đề cử</h4>
              <Link to={routeLink.comics}>Xem tất cả</Link>
            </SectionHeading>
            <SectionBody>
              <div className="list-story">
                {datas.length > 0 ? (
                  datas.map((data, index) => <ComicCard key={index} comic={data} />)
                ) : (
                  <NoData />
                )}
              </div>
            </SectionBody>
          </Section>
        </div>

        <div className="col-4">
          <Section>
            <SectionHeading>
              <h4 className="section-title">Đang đọc</h4>
              <Link to="/user/bookshelf">Xem tất cả</Link>
            </SectionHeading>
            <SectionBody>
              <div className="list-reading">
                {readings.length > 0 ? (
                  readings.map((item, i) => <Reading key={i} data={item} />)
                ) : (
                  <NoData />
                )}
              </div>
            </SectionBody>
          </Section>
        </div>
      </div>
    </>
  );
}

export default ListStory;
