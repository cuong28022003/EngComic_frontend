import "./styles.scss";
import { useSelector } from "react-redux";
import crownAnimation from "../../assets/lottie/crown.json";
import Lottie from "lottie-react";
import avt from "../../assets/image/avt.png";

const RANK_FRAMES = {
    Bronze: "/images/frame-avatar/bronze.png",
    Silver: "/images/frame-avatar/silver.png",
    Gold: "/images/frame-avatar/gold.png",
    Platinum: "/images/frame-avatar/platinum.png",
    Diamond: "/images/frame-avatar/diamond.png",
    Master: "/images/frame-avatar/master.png",
    Grandmaster: "/images/frame-avatar/grandmaster.png",
    Legend: "/images/frame-avatar/legend.png",
    Premium: "/images/frame-avatar/premium.png",
};

const Avatar = ({ src, userStats, size = 64 }) => {
    const isPremium = userStats?.premium;
    const rank = userStats?.rank?.name || "Bronze";
    const frameSrc = RANK_FRAMES[rank] || null;
    const premiumFrameSrc = RANK_FRAMES.Premium;

    const avatarSize = {
        width: size,
        height: size,
    };

    return (
        <div className={`avatar-wrapper ${isPremium ? 'premium' : ''}`} style={avatarSize}>
            {isPremium && <img src={premiumFrameSrc} alt="premium frame" className="avatar-frame premium-frame" />}
            {frameSrc && <img src={frameSrc} alt="frame" className="avatar-frame" />}
            <img
                src={src || avt}
                alt="avatar"
                className="avatar-img"
            />

            {/* {isPremium && (
                <div className="crown-icon" title="VIP Member">
                    <Lottie animationData={crownAnimation} loop={true} />
                </div>
            )} */}
        </div>
    );
};

export default Avatar;
