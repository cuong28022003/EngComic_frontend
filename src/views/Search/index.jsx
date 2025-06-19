import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.scss";
import { useSearchParams } from "react-router-dom";
import { searchComics } from "../../api/comicApi";
import { ComicGenres } from "../../constant/enum";
import Pagination from "../../components/Pagination/index.jsx";
import ComicCard from "../../components/ComicCard/index.jsx";
import NoData from "../../components/NoData/index.jsx";

const sortOptions = [
  { value: "views", label: "Lượt xem" },
  { value: "updatedAt", label: "Ngày cập nhật" },
  { value: "rating", label: "Đánh giá" },
];

const englishLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

const genres = ComicGenres;

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const [comics, setComics] = useState([]);

  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [englishLevel, setEnglishLevel] = useState(searchParams.get("level") || "");
  const [sortBy, setSortBy] = useState("views");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const keyword = searchParams.get("keyword") || "";
  console.log("Keyword:", keyword);
  const artist = searchParams.get("artist") || "";

  const handlePageChange = (newPage) => {
    setPage(newPage - 1);
  };

  const fetchComics = async () => {
    setLoading(true);
    try {
      const params = {
        keyword: keyword,
        genre: genre,
        artist: artist,
        status: "ACTIVE",
        englishLevel: englishLevel,
        sortBy,
        sortDir,
        page,
        size: 6,
      }
      const res = await searchComics(params);
      setComics(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch comics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
  }, [keyword, genre, artist]);

  useEffect(() => {
    fetchComics();
  }, [keyword, genre, englishLevel, sortBy, sortDir, page]);

  return (
    <div className="search-container">
      <aside className="sidebar">
        <h2>Thể loại</h2>
        <ul className="genre-list">
          <li
            className={!genre ? "active" : ""}
            onClick={() => setGenre("")}
          >
            Tất cả
          </li>
          {genres.map((g) => (
            <li
              key={g}
              className={genre === g ? "active" : ""}
              onClick={() => setGenre(g)}
            >
              {g}
            </li>
          ))}
        </ul>
      </aside>

      <main className="main-content">
        <div className="sort-bar">
          <div className="sort-controls">
            {/* Thêm dropdown chọn English Level */}
            <select
              value={englishLevel}
              onChange={(e) => setEnglishLevel(e.target.value)}
            >
              <option value="">Trình độ: Tất cả</option>
              {englishLevels.map((level) => (
                <option key={level} value={level}>
                  Trình độ: {level}
                </option>
              ))}
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sắp xếp: {opt.label}
                </option>
              ))}
            </select>

            <select value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
              <option value="desc">Giảm dần</option>
              <option value="asc">Tăng dần</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Đang tải truyện...</div>
        ) : comics.length === 0 ? (
            <NoData message="Không tìm thấy truyện nào phù hợp." />
        ) : (
          <div className="comic-grid">
            {comics.map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={page + 1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
};

export default SearchPage;
