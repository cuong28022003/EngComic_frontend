# SpriteCanvas Component

Component React tái sử dụng để hiển thị sprite animation, dựa trên class `Sprite` trong FightingGame.

## Tính năng

- ✅ Hỗ trợ sprite sheet với nhiều frames
- ✅ Animation tự động với frame rate có thể điều chỉnh
- ✅ Flip sprite (facing left/right)
- ✅ Scale sprite
- ✅ Position và offset tùy chỉnh
- ✅ Loop hoặc play once
- ✅ Callback khi animation hoàn thành
- ✅ Pixel-perfect rendering

## Props

| Prop                  | Type     | Default      | Mô tả                                               |
| --------------------- | -------- | ------------ | --------------------------------------------------- |
| `imageSrc`            | string   | _required_   | Đường dẫn đến sprite sheet                          |
| `width`               | number   | 200          | Chiều rộng canvas (px)                              |
| `height`              | number   | 200          | Chiều cao canvas (px)                               |
| `scale`               | number   | 1            | Tỉ lệ phóng to sprite                               |
| `framesMax`           | number   | 1            | Tổng số frames trong sprite sheet                   |
| `framesHold`          | number   | 5            | Số frames giữ trước khi chuyển sang frame tiếp theo |
| `position`            | object   | {x: 0, y: 0} | Vị trí vẽ sprite                                    |
| `offset`              | object   | {x: 0, y: 0} | Offset để điều chỉnh vị trí vẽ                      |
| `facing`              | number   | 1            | Hướng nhìn: 1 = phải, -1 = trái                     |
| `animate`             | boolean  | true         | Bật/tắt animation                                   |
| `loop`                | boolean  | true         | Lặp lại animation                                   |
| `onAnimationComplete` | function | undefined    | Callback khi animation kết thúc (khi loop=false)    |
| `className`           | string   | ''           | CSS class tùy chỉnh                                 |

## Ví dụ sử dụng

### 1. Sprite đơn giản (idle animation)

```jsx
import SpriteCanvas from "@/components/SpriteCanvas";

<SpriteCanvas
  imageSrc="/img/kenji/Sprites/Idle.png"
  width={200}
  height={200}
  scale={2.5}
  framesMax={8}
  framesHold={5}
/>;
```

### 2. Sprite với vị trí tùy chỉnh

```jsx
<SpriteCanvas
  imageSrc="/img/samuraiMack/Sprites/Run.png"
  width={300}
  height={300}
  scale={3}
  framesMax={8}
  position={{ x: 50, y: 50 }}
  offset={{ x: 215, y: 157 }}
/>
```

### 3. Sprite lật ngược (facing left)

```jsx
<SpriteCanvas
  imageSrc="/img/kenji/Sprites/Attack1.png"
  width={400}
  height={400}
  scale={2.5}
  framesMax={6}
  facing={-1}
/>
```

### 4. Animation không lặp lại với callback

```jsx
<SpriteCanvas
  imageSrc="/img/kenji/Sprites/Death.png"
  width={300}
  height={300}
  scale={2.5}
  framesMax={6}
  loop={false}
  onAnimationComplete={() => {
    console.log("Death animation completed!");
  }}
/>
```

### 5. Sprite tĩnh (không animation)

```jsx
<SpriteCanvas
  imageSrc="/img/character.png"
  width={100}
  height={100}
  scale={1}
  framesMax={1}
  animate={false}
/>
```

### 6. Sử dụng trong component khác

```jsx
import React, { useState } from "react";
import SpriteCanvas from "@/components/SpriteCanvas";

const CharacterDisplay = ({ character }) => {
  const [facing, setFacing] = useState(1);

  return (
    <div>
      <SpriteCanvas
        imageSrc={character.idleSprite}
        width={250}
        height={250}
        scale={2.5}
        framesMax={8}
        framesHold={8}
        facing={facing}
      />
      <button onClick={() => setFacing(facing * -1)}>Flip Character</button>
    </div>
  );
};
```

### 7. Hiển thị nhiều sprites

```jsx
const SpriteShowcase = () => {
  const sprites = [
    { name: "Idle", src: "/img/kenji/Sprites/Idle.png", frames: 8 },
    { name: "Run", src: "/img/kenji/Sprites/Run.png", frames: 8 },
    { name: "Jump", src: "/img/kenji/Sprites/Jump.png", frames: 2 },
    { name: "Attack", src: "/img/kenji/Sprites/Attack1.png", frames: 6 },
  ];

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {sprites.map((sprite) => (
        <div key={sprite.name}>
          <h3>{sprite.name}</h3>
          <SpriteCanvas
            imageSrc={sprite.src}
            width={200}
            height={200}
            scale={2}
            framesMax={sprite.frames}
            framesHold={6}
          />
        </div>
      ))}
    </div>
  );
};
```

## Sự khác biệt với class Sprite

| Class Sprite                    | SpriteCanvas Component            |
| ------------------------------- | --------------------------------- |
| Cần khởi tạo với `new Sprite()` | Sử dụng như React component       |
| Cần gọi `update(c)` thủ công    | Tự động update/animate            |
| Cần quản lý canvas context      | Canvas được quản lý tự động       |
| Dùng trong game loop            | Dùng ở bất kỳ đâu trong React app |
| Imperative API                  | Declarative API (props)           |

## Performance Tips

1. **Reuse canvas size**: Giữ nguyên `width` và `height` để tránh canvas resize
2. **Optimize framesHold**: Tăng giá trị để giảm số lần render
3. **Use memo**: Wrap component với `React.memo()` nếu props ít thay đổi
4. **Preload images**: Load images trước để tránh flicker

```jsx
// Example with React.memo
export default React.memo(SpriteCanvas, (prevProps, nextProps) => {
  return (
    prevProps.imageSrc === nextProps.imageSrc &&
    prevProps.facing === nextProps.facing
  );
});
```
