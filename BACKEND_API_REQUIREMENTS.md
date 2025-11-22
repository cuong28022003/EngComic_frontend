# Backend API Requirements for Age Rating Filter

## Endpoint: GET /comics/search

### New Parameters for Age Rating Filter

#### Existing Parameters:

- `keyword` (string): Từ khóa tìm kiếm
- `genre` (string): Thể loại truyện
- `artist` (string): Tên tác giả
- `status` (string): Trạng thái truyện (ACTIVE, INACTIVE)
- `englishLevel` (string): Trình độ tiếng Anh (A1, A2, B1, B2, C1, C2)
- `sortBy` (string): Trường sắp xếp (views, updatedAt, rating)
- `sortDir` (string): Hướng sắp xếp (asc, desc)
- `page` (number): Số trang (0-based)
- `size` (number): Số lượng item mỗi trang

#### New Parameters:

- `ageRating` (string, optional): Lọc theo độ tuổi cụ thể ("13+", "16+", "18+")
- `includeAdultContent` (boolean): Có hiển thị nội dung 18+ hay không
- `maxAge` (number): Tuổi tối đa của user (để backend tự động filter)

### Backend Logic Implementation

#### 1. Age Rating Filter Logic:

```sql
-- Cơ bản: Filter theo ageRating nếu được chỉ định
WHERE (
    -- Nếu không có ageRating parameter, hiển thị tất cả trừ 18+ (nếu includeAdultContent = false)
    (@ageRating IS NULL AND (comics.age_rating != '18+' OR @includeAdultContent = true))
    OR
    -- Nếu có ageRating parameter, chỉ hiển thị truyện có age_rating đó
    (@ageRating IS NOT NULL AND comics.age_rating = @ageRating)
)
```

#### 2. Adult Content Protection:

```sql
-- Không bao giờ hiển thị nội dung 18+ nếu includeAdultContent = false
AND (comics.age_rating != '18+' OR @includeAdultContent = true)
```

#### 3. Age-based Access Control:

```sql
-- Kiểm tra tuổi user với yêu cầu của truyện
AND (
    comics.age_rating = 'ALL' OR
    (comics.age_rating = '13+' AND @maxAge >= 13) OR
    (comics.age_rating = '16+' AND @maxAge >= 16) OR
    (comics.age_rating = '18+' AND @maxAge >= 18 AND @includeAdultContent = true)
)
```

### Complete Query Example:

```sql
SELECT c.*, COUNT(*) OVER() as total_count
FROM comics c
WHERE c.status = 'ACTIVE'
  -- Keyword search
  AND (@keyword IS NULL OR c.title ILIKE '%' || @keyword || '%')
  -- Genre filter
  AND (@genre IS NULL OR c.genre = @genre)
  -- Artist filter
  AND (@artist IS NULL OR c.artist ILIKE '%' || @artist || '%')
  -- English level filter
  AND (@englishLevel IS NULL OR c.english_level = @englishLevel)
  -- Age rating filter
  AND (
    -- Nếu không chỉ định ageRating, hiển thị theo includeAdultContent
    (@ageRating IS NULL AND (c.age_rating != '18+' OR @includeAdultContent = true))
    OR
    -- Nếu chỉ định ageRating, chỉ hiển thị truyện đó
    (@ageRating IS NOT NULL AND c.age_rating = @ageRating)
  )
  -- Age-based access control
  AND (
    c.age_rating = 'ALL' OR
    (c.age_rating = '13+' AND @maxAge >= 13) OR
    (c.age_rating = '16+' AND @maxAge >= 16) OR
    (c.age_rating = '18+' AND @maxAge >= 18 AND @includeAdultContent = true)
  )
ORDER BY
  CASE WHEN @sortBy = 'views' AND @sortDir = 'desc' THEN c.views END DESC,
  CASE WHEN @sortBy = 'views' AND @sortDir = 'asc' THEN c.views END ASC,
  CASE WHEN @sortBy = 'updatedAt' AND @sortDir = 'desc' THEN c.updated_at END DESC,
  CASE WHEN @sortBy = 'updatedAt' AND @sortDir = 'asc' THEN c.updated_at END ASC,
  CASE WHEN @sortBy = 'rating' AND @sortDir = 'desc' THEN c.rating END DESC,
  CASE WHEN @sortBy = 'rating' AND @sortDir = 'asc' THEN c.rating END ASC
LIMIT @size OFFSET (@page * @size);
```

### Response Format:

```json
{
  "data": {
    "content": [
      {
        "id": "comic-id",
        "title": "Comic Title",
        "ageRating": "16+",
        "genre": "Action",
        "views": 1000,
        "rating": 4.5
        // ... other comic fields
      }
    ],
    "totalPages": 10,
    "totalElements": 57,
    "page": 0,
    "size": 6,
    "first": true,
    "last": false
  }
}
```

### Frontend Request Examples:

#### 1. Get all comics (adult mode OFF):

```javascript
GET /comics/search?includeAdultContent=false&maxAge=25&page=0&size=6
```

#### 2. Get only 18+ comics (adult mode ON):

```javascript
GET /comics/search?ageRating=18%2B&includeAdultContent=true&maxAge=25&page=0&size=6
```

#### 3. Get 16+ comics:

```javascript
GET /comics/search?ageRating=16%2B&includeAdultContent=true&maxAge=25&page=0&size=6
```

#### 4. Search with keyword and filters:

```javascript
GET /comics/search?keyword=action&genre=Adventure&ageRating=13%2B&includeAdultContent=false&maxAge=25&sortBy=views&sortDir=desc&page=0&size=6
```

### Security Considerations:

1. **Server-side validation**: Backend phải validate tất cả parameters
2. **Age verification**: Không tin tưởng hoàn toàn `maxAge` từ frontend
3. **Adult content protection**: Luôn check `includeAdultContent` trước khi trả về nội dung 18+
4. **Rate limiting**: Implement rate limiting cho search endpoint
5. **Input sanitization**: Sanitize tất cả string inputs để tránh SQL injection

### Error Handling:

```json
{
  "error": {
    "code": "INVALID_AGE_RATING",
    "message": "Invalid age rating. Allowed values: ALL, 13+, 16+, 18+",
    "details": "ageRating parameter must be one of: 13+, 16+, 18+"
  }
}
```

### Performance Optimization:

1. **Database Indexes**:

   - Index on `age_rating` column
   - Composite index on `(status, age_rating, genre)`
   - Index on `english_level`

2. **Caching**: Cache popular search results with TTL

3. **Pagination**: Sử dụng cursor-based pagination cho datasets lớn

Backend developers có thể sử dụng document này để implement filtering logic phù hợp với requirements của frontend.
