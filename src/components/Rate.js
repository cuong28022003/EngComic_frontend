import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiMain from "../api/apiMain";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/slice/auth";

const Rate = (props) => {
    const url = props.url;
    console.log(url);
    const user = useSelector(state => state.auth.login?.user)
    const dispatch = useDispatch();
    const [userRating, setUserRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const res = await apiMain.getComicRating({ url }, user, dispatch, loginSuccess);
                setAverageRating(res.averageRating);
                setTotalReviews(res.totalReviews);
                if (user) setUserRating(res.userRating || 0);
            } catch (err) {
                console.error("Error fetching rating:", err);
            }
        };

        fetchRating();
    }, [url, user, userRating]);

    const handleRate = async (rating) => {
        if (!user) {
            toast.warning("Bạn cần đăng nhập để đánh giá!");
            return;
        }

        try {
            const res = await apiMain.rateComic({ url, rating }, user, dispatch, loginSuccess);
            setUserRating(res.userRating);
            setAverageRating(res.averageRating);
            setTotalReviews(res.totalReviews);
            toast.success("Đánh giá thành công!");
            window.location.reload();
        } catch (err) {
            console.error("Error rating comic:", err);
            toast.error("Đánh giá thất bại!");
        }
    };

    const handleDeleteRating = async () => {
        if (!user) {
            toast.warning("Bạn cần đăng nhập để xóa đánh giá!");
            return;
        }

        try {
            const response = await apiMain.deleteComicRating({ url }, user, dispatch, loginSuccess);
            console.log(response);
            setUserRating(0);
            toast.success("Xóa đánh giá thành công!");
            window.location.reload();
        } catch (err) {
            console.error("Error deleting rating:", err);
            toast.error("Xóa đánh giá thất bại!");
        }
    };

    return (
        <div className="rate-container">
            <h3>Đánh giá truyện</h3>
            <div className="rate-options">
                {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                        key={rating}
                        className={`rate-button ${userRating === rating ? "active" : ""}`}
                        onClick={() => handleRate(rating)}
                    >
                        {rating} Sao
                    </button>
                ))}
            </div>
            {userRating > 0 && (
                <div className="rate-actions">
                    <p>Bạn đã đánh giá: {userRating} sao</p>
                    <button className="delete-button" onClick={handleDeleteRating}>
                        Xóa đánh giá
                    </button>
                </div>
            )}
        </div>
    );
};

export default Rate;
