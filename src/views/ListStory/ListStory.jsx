import { useEffect, useState } from "react";
import apiMain from "../../api/apiMain";
import Reading from "../../components/Reading";
import Section, { SectionHeading, SectionBody } from "../../components/section";
import Story from "../../components/Story";
import getData from "../../api/getData";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loginSuccess } from "../../redux/authSlice";
import "./ListStory.scss";

function ListStory() {
  const [datas, setData] = useState([]);
  const [readings, setReadings] = useState([]);
  const user = useSelector((state) => state.auth.login.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const getReadings = async () => {
      // Xử lý gọi API thông tin đang đọc
      if (user) {
        apiMain
          .getReadings(user, dispatch, loginSuccess)
          .then((res) => {
            setReadings(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    getReadings(); // gọi hàm
  }, [user, dispatch]);

  useEffect(() => {
    const getStory = async () => {
      // Xử lý gọi hàm load truyện
      const res = getData(await apiMain.getStorys({ size: 6 }));
      setData(res);
    };
    getStory();
  }, []);

  return (
    <>
      <div className="d-flex">
        <div className="col-8">
          <Section>
            <SectionHeading>
              <h4 className="section-title">Biên tập viên đề cử</h4>
              <Link to="comic-list">Xem tất cả</Link>
            </SectionHeading>
            <SectionBody>
              <div className="list-story">
                {datas.length > 0 ? (
                  datas.map((data, index) => <Story key={index} data={data} />)
                ) : (
                  <p>Không có truyện nào để hiển thị.</p>
                )}
              </div>
            </SectionBody>
          </Section>
        </div>

        <div className="col-4">
          <Section>
            <SectionHeading>
              <h4 className="section-title">Đang đọc</h4>
              <Link to="/user/tu-truyen/reading">Xem tất cả</Link>
            </SectionHeading>
            <SectionBody>
              <div className="list-reading">
                {readings.length > 0 ? (
                  readings.map((item, i) => <Reading key={i} data={item} />)
                ) : (
                  <p>Không có truyện đang đọc.</p>
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
