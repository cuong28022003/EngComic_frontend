/**
 * Tính tuổi của user dựa trên ngày sinh
 * @param {string|Date} birthday - Ngày sinh của user
 * @returns {number} Tuổi của user
 */
export const calculateAge = (birthday) => {
    if (!birthday) return 0;

    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

/**
 * Kiểm tra user có đủ 18 tuổi không
 * @param {string|Date} birthday - Ngày sinh của user
 * @returns {boolean} True nếu đủ 18 tuổi
 */
export const isAdult = (birthday) => {
    return calculateAge(birthday) >= 18;
};

/**
 * Kiểm tra truyện có phù hợp với độ tuổi không
 * @param {string} ageRating - Độ tuổi yêu cầu của truyện ("ALL", "13+", "16+", "18+")
 * @param {boolean} isAdultModeEnabled - Adult mode có được bật không
 * @param {number} userAge - Tuổi của user
 * @returns {boolean} True nếu truyện phù hợp
 */
export const isComicSuitableForUser = (ageRating, isAdultModeEnabled, userAge) => {
    if (!ageRating) return true;

    // Nếu là truyện 18+ nhưng adult mode chưa được bật
    if (ageRating === "18+" && !isAdultModeEnabled) {
        return false;
    }

    // Kiểm tra độ tuổi
    switch (ageRating) {
        case "ALL":
            return true;
        case "13+":
            return userAge >= 13;
        case "16+":
            return userAge >= 16;
        case "18+":
            return userAge >= 18 && isAdultModeEnabled;
        default:
            return true;
    }
};
