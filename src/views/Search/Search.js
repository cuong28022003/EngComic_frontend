import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiMain from "../../api/apiMain";
import Story from "../../components/Story";
import Section, { SectionHeading, SectionBody } from "../../components/section";
import { useLocation } from "react-router-dom";

function Search(props) {
  const [datas, setDatas] = useState([]);
  const [filter, setFilter] = useState(""); // Lưu trạng thái bộ lọc
  const location = useLocation();
  const query = useSelector((state) => state?.message?.query || "");
  const name = location.state?.name || "";
  const artist = location.state?.artist || "";
  const genre = location.state?.genre || "";
  console.log("name: " + name);
  console.log("genre: " + genre);
  console.log("artist: " + artist);
  useEffect(() => {
    const fetchStories = async () => {
      if (!name && !artist && !genre) {
        setDatas([]);
        return;
      }
      try {
        const response = await apiMain.getFilteredComics({
          name: name,
          artist: artist,
          genre: genre,
          filter,
        });
        if (response) {
          setDatas(response);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStories();
  }, [name, filter]);

  return (
    <>
      <span className="imgHero"></span>
      <div className="main">
        <div className="container">
          <div className="main-content">
            <div className="d-flex">
              <Section>
                <SectionHeading>
                  <h4 className="section-title">Kết quả</h4>
                  {/* Bộ lọc */}
                  <div className="filter">
                    <label htmlFor="filter-select">Lọc:</label>
                    <select
                      id="filter-select"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="">Tất cả</option>
                      <option value="views">Lượt đọc</option>
                      <option value="rating">Đánh giá</option>
                      <option value="updateAt">Mới nhất</option>
                    </select>
                  </div>
                </SectionHeading>
                <SectionBody>
                  <div className="list-story">
                    {datas.map((data, index) => (
                      <Story key={index} data={data} />
                    ))}
                  </div>
                </SectionBody>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
