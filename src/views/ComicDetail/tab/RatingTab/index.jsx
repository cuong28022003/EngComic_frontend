import { useEffect, useState } from "react";
import "./styles.scss";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getRatingsByComicId, submitRating } from "../../../../api/ratingApi";
import { loginSuccess, logoutSuccess } from "../../../../redux/slice/auth";

const RatingTab = ({ comicId }) => {
    const [ratings, setRatings] = useState([]);
    const [myRating, setMyRating] = useState(null);
    console.log("myRating: ", myRating);
    const [newRating, setNewRating] = useState({ rating: 0, comment: "" });
    const currentUser = useSelector(state => state.auth.login.user);
    const dispatch = useDispatch();

    const countStars = [5, 4, 3, 2, 1].map(star => {
        const count = ratings.filter(r => r.rating === star).length;
        return { star, count };
    });

    const total = ratings.length;
    const [filterStar, setFilterStar] = useState(0); // 0 = tất cả


    useEffect(() => {
        getRatingsByComicId(comicId).then(res => {
            setRatings(res.data.content);
            if (currentUser) {
                const found = res.data.content.find(r => r.user.id === currentUser.id);
                setMyRating(found || null);
                if (found) setNewRating({ rating: found.rating, comment: found.comment });
            }
        });
    }, [comicId]);

    const handleSubmit = () => {
        const payload = {
            ...newRating,
            comicId,
            userId: currentUser.id,
        };
        submitRating(payload, currentUser, dispatch, loginSuccess).then(res => {
            setMyRating(res.data);
            setRatings(prev => [
                res.data,
                ...prev.filter(r => r.user.id !== currentUser.id) // Sửa lại dòng này
            ]);
        });
    };

    const filteredRatings = filterStar === 0
        ? ratings
        : ratings.filter(r => r.rating === filterStar);


    return (
        <div className="rating-tab">
            <div className="summary">
                <h3>Đánh Giá Truyện</h3>
                <div className="average">
                    ⭐ {ratings.length > 0 ? (
                        (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
                    ) : "Chưa có đánh giá"}
                </div>
                <div className="total-reviews">{ratings.length} lượt đánh giá</div>
            </div>

            {currentUser && (
                    <div className="my-rating">
                    <h4>Đánh giá của bạn</h4>
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map(i => (
                            <span
                                key={i}
                                className={newRating.rating >= i ? "filled" : ""}
                                onClick={() => setNewRating({ ...newRating, rating: i })}
                            >★</span>
                        ))}
                    </div>
                    <textarea
                        placeholder="Nhận xét của bạn"
                        value={newRating.comment}
                        onChange={e => setNewRating({ ...newRating, comment: e.target.value })}
                    />
                    <button onClick={handleSubmit}>
                        {myRating ? "Sửa đánh giá" : "Gửi đánh giá"}
                    </button>
                </div>
            )}

            <div className="rating-stats">
                {countStars.map(({ star, count }) => {
                    const percent = total === 0 ? 0 : Math.round((count / total) * 100);
                    return (
                        <div key={star} className="rating-row">
                            <span className="star-label">{star} ★</span>
                            <div className="progress-bar">
                                <div className="fill" style={{ width: `${percent}%` }}></div>
                            </div>
                            <span className="percent">{percent}%</span>
                        </div>
                    );
                })}
            </div>

            <div className="rating-filters">
                <button
                    className={filterStar === 0 ? "active" : ""}
                    onClick={() => setFilterStar(0)}
                >
                    Tất cả ({ratings.length})
                </button>
                {countStars.map(({ star, count }) => (
                    <button
                        key={star}
                        className={filterStar === star ? "active" : ""}
                        onClick={() => setFilterStar(star)}
                    >
                        {star} ★ ({count})
                    </button>
                ))}
            </div>

            <div className="rating-list">
                {filteredRatings.length > 0 ? (
                    filteredRatings.map(r => (
                        <div className="rating-item" key={r.id}>
                            <div className="user">{r?.user?.fullName || r?.user?.username}</div>
                            <div className="stars">
                                {[...Array(r.rating)].map((_, i) => <span key={i}>★</span>)}
                            </div>
                            <div className="comment">{r.comment}</div>
                            <div className="date">{r.createdAt}</div>
                        </div>
                    ))
                ) : (
                    <p>Không có đánh giá nào</p>
                )}
            </div>
        </div>
    );
};

export default RatingTab;
