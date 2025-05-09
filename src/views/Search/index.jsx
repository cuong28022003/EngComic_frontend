import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Comic from "../../components/Comic";
import Section, { SectionHeading, SectionBody } from "../../components/section";
import LoadingData from "../../components/Loading/LoadingData";
import { searchComics } from "../../api/comicApi";
import { set } from "lodash";

function SearchPage() {
  const [comics, setComics] = useState([]);
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const name = searchParams.get("keyword") || "";
  const artist = searchParams.get("artist") || "";
  const genre = searchParams.get("genre") || "";

  useEffect(() => {
    const fetchComics = async () => {
      if (!name && !artist && !genre) {
        setComics([]);
        return;
      }
      try {
        setLoading(true);
        const response = await searchComics({
          name,
          artist,
          genre,
          sort,
        });
        setComics(response.content || []);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setComics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, [name, artist, genre, sort]);

  if (loading) {
    return <LoadingData />;
  }

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
                    {comics.length > 0 ? (
                      comics.map((data, index) => (
                        <Comic key={index} data={data} />
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

export default SearchPage;
