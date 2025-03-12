import React, { useEffect, useState } from "react";
import Comic from "../../components/Comic";
import Section, { SectionHeading, SectionBody } from "../../components/section";
import LoadingData from "../../components/Loading/LoadingData";
import { getComics } from "../../api/comicApi";
import Pagination from "../../components/Pagination/index";

function ComicList() {
  const [comics, setComics] = useState([]);
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getComics({
          sort: sort,
          page: currentPage - 1,
          size: 3,
        });
        if (response) {
          setComics(response.content);
          setTotalPages(response.totalPages);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [sort, currentPage]);

  if (loading) {
    return <LoadingData />;
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <a>
        <span className="imgHero"></span>
      </a>

      <div className="main">
        <div className="container">
          <div className="main-content">
            <div className="d-flex">
              <Section>
                <SectionHeading>
                  <h4 className="section-title">Tất cả</h4>
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
                    {comics.map((data, index) => (
                      <Comic key={index} data={data} />
                    ))}
                  </div>
                </SectionBody>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </Section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ComicList;
