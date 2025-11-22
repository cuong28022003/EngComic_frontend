# Adult Mode Feature

## Tổng quan

Tính năng Adult Mode cho phép người dùng từ 18 tuổi trở lên có thể xem nội dung dành cho người lớn (truyện có ageRating là "18+").

## Cách hoạt động

### 1. Kiểm tra độ tuổi

- Hệ thống sẽ tính tuổi dựa trên ngày sinh của user
- Chỉ user đủ 18 tuổi mới thấy được nút "Bật chế độ người lớn"

### 2. Kích hoạt Adult Mode

- User bấm nút "Bật chế độ người lớn" trong trang Profile
- Hệ thống hiển thị popup xác nhận: "Bạn có xác nhận đã đủ 18 tuổi để xem nội dung dành cho người lớn không?"
- Sau khi xác nhận, adult mode được bật và user có thể xem truyện 18+

### 3. Phân loại nội dung theo độ tuổi

- `"ALL"`: Phù hợp cho mọi lứa tuổi
- `"13+"`: Dành cho 13 tuổi trở lên
- `"16+"`: Dành cho 16 tuổi trở lên
- `"18+"`: Chỉ hiển thị khi user đủ 18 tuổi VÀ đã bật adult mode

## Files đã thêm/sửa đổi

### Files mới:

1. `src/redux/slice/adultMode.js` - Redux slice quản lý state adult mode
2. `src/utils/ageUtils.js` - Utilities tính tuổi và kiểm tra nội dung phù hợp
3. `src/components/AdultModeConfirmDialog/index.jsx` - Dialog xác nhận bật adult mode
4. `src/hooks/useAdultMode.js` - Custom hook để sử dụng adult mode trong components

### Files đã sửa đổi:

1. `src/redux/store.js` - Thêm adultMode reducer
2. `src/views/Account/Profile/Profile.js` - Thêm UI và logic adult mode toggle
3. `src/views/Account/Profile/styles.scss` - Thêm styles cho adult mode section

## Cách sử dụng trong code

### 1. Sử dụng useAdultMode hook:

```javascript
import useAdultMode from '../hooks/useAdultMode';

const MyComponent = () => {
    const {
        isAdultModeEnabled,
        filterComicsByAdultMode,
        isComicSuitable
    } = useAdultMode();

    // Filter danh sách truyện
    const suitableComics = filterComicsByAdultMode(allComics);

    // Kiểm tra một truyện cụ thể
    const canViewComic = isComicSuitable(comic);

    return (
        // JSX component
    );
};
```

### 2. Sử dụng Redux state trực tiếp:

```javascript
import { useSelector } from "react-redux";

const isAdultModeEnabled = useSelector(
  (state) => state.adultMode.isAdultModeEnabled
);
```

### 3. Sử dụng utility functions:

```javascript
import {
  isAdult,
  calculateAge,
  isComicSuitableForUser,
} from "../utils/ageUtils";

const userAge = calculateAge(user.birthday);
const canSeeAdultContent = isAdult(user.birthday);
const canViewComic = isComicSuitableForUser(
  comic.ageRating,
  isAdultModeEnabled,
  userAge
);
```

## Lưu ý

- Adult mode state được persist trong localStorage thông qua redux-persist
- Chỉ user đủ 18 tuổi mới thấy được option bật adult mode
- Khi tắt adult mode, các truyện 18+ sẽ bị ẩn ngay lập tức
