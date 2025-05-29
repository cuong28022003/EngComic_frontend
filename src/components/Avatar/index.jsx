import "./styles.scss";
import { useSelector } from "react-redux";
import crownAnimation from "../../assets/lottie/crown.json";
import Lottie from "lottie-react";

const RANK_FRAMES = {
    Bronze: "/images/silver.png",
    Silver: "/images/silver.png",
    Gold: "/images/silver.png",
    Diamond: "/images/silver.png",
};

const Avatar = ({ src, userStats, size = 64 }) => {
    const isPremium = userStats?.premium;
    const rank = userStats?.rank?.name || "Bronze";
    const frameSrc = RANK_FRAMES[rank] || null;

    const avatarSize = {
        width: size,
        height: size,
    };

    return (
        <div className="avatar-wrapper" style={avatarSize}>
            {frameSrc && <img src={frameSrc} alt="frame" className="avatar-frame" />}
            <img
                src={src}
                alt="avatar"
                className="avatar-img"
            />

            {isPremium && (
                <div className="crown-icon  " title="VIP Member">
                    <Lottie animationData={crownAnimation} loop={true} />
                </div>
            )}
        </div>
    );
};

export default Avatar;
