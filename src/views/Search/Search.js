import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import apiMain from "../../api/apiMain";
import Story from "../../components/Story";
import Section, { SectionHeading, SectionBody } from "../../components/section";

function Search() {
  const [datas, setDatas] = useState([]);
  const [sort, setSort] = useState("");
  const location = useLocation();
  const name = location.state?.name || "";
  const [searchParams] = useSearchParams();
  const artist = searchParams.get("artist");
  const genre = searchParams.get("genre");

  useEffect(() => {
    const fetchStories = async () => {
      if (!name && !artist && !genre) {
        setDatas([]);
        return;
      }
      try {
        const response = await apiMain.getFilteredComics({
          name,
          artist,
          genre,
          sort,
        });
        if (Array.isArray(response)) {
          setDatas(response);
        } else {
          setDatas([]);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
        setDatas([]);
      }
    };

    fetchStories();
  }, [name, artist, genre, sort]);

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
                  <div className="filter">
                    <label htmlFor="filter-select">Lọc:</label>
                    <select
                      id="filter-select"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
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
                    {datas.length > 0 ? (
                      datas.map((data, index) => (
                        <Story key={index} data={data} />
                      ))
                    ) : (
                      <div className="no-stories">
                        <i className="fas fa-book-open"></i>
                        <p>
                          {name || artist || genre ? (
                            "Hiện tại không có truyện nào phù hợp với tiêu chí tìm kiếm."
                          ) : (
                            "Vui lòng nhập từ khóa để tìm kiếm truyện."
                          )}
                        </p>
                      </div>
                    )}
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
