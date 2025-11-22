import { useSelector } from 'react-redux';
import { calculateAge, isComicSuitableForUser } from '../utils/ageUtils';

/**
 * Custom hook để quản lý adult mode và filter nội dung
 * @returns {Object} Các function và state liên quan đến adult mode
 */
export const useAdultMode = () => {
    const user = useSelector((state) => state.auth.login?.user);
    const isAdultModeEnabled = useSelector((state) => state.adultMode.isAdultModeEnabled);

    const userAge = calculateAge(user?.birthday);
    const userIsAdult = userAge >= 18;

    /**
     * Filter danh sách truyện theo adult mode và độ tuổi của user
     * @param {Array} comics - Danh sách truyện
     * @returns {Array} Danh sách truyện đã được filter
     */
    const filterComicsByAdultMode = (comics) => {
        if (!comics || !Array.isArray(comics)) return [];

        return comics.filter(comic =>
            isComicSuitableForUser(comic.ageRating, isAdultModeEnabled, userAge)
        );
    };

    /**
     * Kiểm tra một truyện có phù hợp với setting hiện tại không
     * @param {Object} comic - Object truyện
     * @returns {boolean} True nếu truyện phù hợp
     */
    const isComicSuitable = (comic) => {
        return isComicSuitableForUser(comic?.ageRating, isAdultModeEnabled, userAge);
    };

    /**
     * Lấy message thông báo khi truyện không phù hợp
     * @param {string} ageRating - Độ tuổi yêu cầu của truyện
     * @returns {string} Message thông báo
     */
    const getUnsuitableMessage = (ageRating) => {
        if (ageRating === "18+" && !isAdultModeEnabled) {
            return "Nội dung này chỉ dành cho người lớn. Vui lòng bật chế độ người lớn trong trang cá nhân.";
        }
        if (ageRating === "18+" && userAge < 18) {
            return "Nội dung này chỉ dành cho người từ 18 tuổi trở lên.";
        }
        if (ageRating === "16+" && userAge < 16) {
            return "Nội dung này chỉ dành cho người từ 16 tuổi trở lên.";
        }
        if (ageRating === "13+" && userAge < 13) {
            return "Nội dung này chỉ dành cho người từ 13 tuổi trở lên.";
        }
        return "Nội dung này không phù hợp với độ tuổi của bạn.";
    };

    return {
        isAdultModeEnabled,
        userAge,
        userIsAdult,
        filterComicsByAdultMode,
        isComicSuitable,
        getUnsuitableMessage
    };
};

export default useAdultMode;
