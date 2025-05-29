import { useState } from "react";
import "./styles.scss";
import { Gem } from "lucide-react";
import PaymentModal from "../PaymentModal";
import { useSelector } from "react-redux";

const TopupCard = ({ diamonds, price, bonus = 0, popular, bestValue }) => {
    const user = useSelector((state) => state.auth.login?.user);
    const username = user?.username;
    const [open, setOpen] = useState(false);
    const handleTopup = () => {
        setOpen(true);
        // alert(`Chức năng nạp ${diamonds} KC với giá ${price} VNĐ chưa được tích hợp.`);
    };

    return (
        <>
            <div className={`topup-card ${popular ? "popular" : ""} ${bestValue ? "best" : ""}`}>
                {popular && <div className="tag">Phổ biến</div>}
                {bestValue && <div className="tag best">Tốt nhất</div>}
                <h3>{diamonds} <Gem size={18} className="icon" /></h3>
                <p className="price">Giá: {price.toLocaleString()}đ</p>
                {bonus > 0 && <p className="bonus">🎁 Tặng thêm {bonus} KC</p>}
                <button className="topup-button" onClick={handleTopup}>Nạp ngay</button>
            </div>

            <PaymentModal
                isOpen={open}
                onClose={() => setOpen(false)}
                diamonds={diamonds + bonus}
                price={price}
                qrImageUrl="/qr/momo.png" // Đường dẫn tới ảnh QR bạn đã có
                user={user}
            />
        </>
    );
};

export default TopupCard;
