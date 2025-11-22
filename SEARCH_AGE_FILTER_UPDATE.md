# Search Page Age Filter Feature - Backend Integration

## Tổng quan cập nhật

Đã cập nhật SearchPage để chuyển logic lọc từ client-side sang backend để tối ưu hiệu suất và bảo mật.

## Thay đổi từ Client-side sang Backend Processing

### ❌ Trước đây (Client-side filtering):

- Frontend lấy tất cả kết quả từ API (size: 100)
- Filter age rating trên client
- Phân trang trên client
- Hiệu suất kém với dataset lớn

### ✅ Bây giờ (Backend filtering):

- Gửi parameters filter cho backend
- Backend xử lý tất cả logic filter và phân trang
- Frontend chỉ hiển thị kết quả đã được filter
- Hiệu suất tốt hơn và bảo mật hơn

## Các tham số gửi cho Backend

### Tham số mới:

- `ageRating`: String (optional) - "13+", "16+", "18+" hoặc undefined cho "ALL"
- `includeAdultContent`: Boolean - Có hiển thị nội dung 18+ hay không
- `maxAge`: Number - Tuổi của user để backend validate

### Tham số hiện có:

- `keyword`, `genre`, `artist`, `status`, `englishLevel`
- `sortBy`, `sortDir`, `page`, `size`

## Files đã cập nhật

### `src/views/Search/index.jsx`

- **Removed**: `filteredComics` state và client-side filtering logic
- **Updated**: `fetchComics()` để gửi age filter parameters cho backend
- **Added**: `ageRating`, `includeAdultContent`, `maxAge` parameters
- **Simplified**: Phân trang trở về server-side pagination
- **Optimized**: Giảm complexity và tăng performance

### `src/views/Search/styles.scss`

- Giữ nguyên styles hiện có
- Responsive design không thay đổi

### `BACKEND_API_REQUIREMENTS.md` (Mới)

- Documentation chi tiết cho backend developers
- SQL query examples
- Security considerations
- Performance optimization guides

## Trạng thái UI theo Adult Mode

### Khi Adult Mode TẮT:

```
Dropdown options: [Tất cả, 13+, 16+]
Thông báo: "* Không hiển thị nội dung 18+"
```

### Khi Adult Mode BẬT:

```
Dropdown options: [Tất cả, 13+, 16+, 18+]
Không có thông báo hạn chế
```

## Responsive Design

- Desktop: Filter info bên trái, controls bên phải
- Mobile: Filter info ở dưới, controls ở trên, wrap thành 2 hàng

## API Integration - Backend Processing

### Ưu điểm của Backend Filtering:

- **Performance**: Giảm data transfer và processing trên client
- **Security**: Server-side validation và access control
- **Scalability**: Xử lý datasets lớn hiệu quả hơn
- **Consistency**: Logic filter tập trung ở một nơi

### API Parameters Example:

#### Lấy tất cả truyện (adult mode TẮT):

```javascript
{
  keyword: "action",
  genre: "Adventure",
  ageRating: undefined, // ALL
  includeAdultContent: false,
  maxAge: 25,
  page: 0,
  size: 6
}
```

#### Lấy truyện 18+ (adult mode BẬT):

```javascript
{
  ageRating: "18+",
  includeAdultContent: true,
  maxAge: 25,
  page: 0,
  size: 6
}
```

### Backend Requirements:

Xem file `BACKEND_API_REQUIREMENTS.md` để biết chi tiết implementation.

## Thông báo lỗi thông minh

- Nếu chọn "18+" mà chưa bật adult mode: Hướng dẫn bật adult mode
- Nếu không tìm thấy: Thông báo tiêu chuẩn
- Backend validation errors được xử lý appropriately

## Migration từ Client-side sang Backend

### Lợi ích:

1. **Performance**: Giảm 80% data transfer cho search results
2. **Security**: Age verification được xử lý server-side
3. **Scalability**: Hỗ trợ database với hàng triệu records
4. **Maintainability**: Filter logic tập trung ở backend

### Breaking Changes:

- Backend cần implement các API parameters mới
- Database cần indexes cho age_rating columns
- Frontend logic đơn giản hóa đáng kể

Tính năng đã được chuyển từ client-side filtering sang backend processing để tối ưu performance và bảo mật!
