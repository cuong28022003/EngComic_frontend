import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './styles.scss'; // bạn cần tạo file scss này

const ImagePage = () => {
    const [selecting, setSelecting] = useState(false);
    const [start, setStart] = useState(null);
    const [box, setBox] = useState(null);
    const overlayRef = useRef(null);

    const handleMouseDown = (e) => {
        setStart({ x: e.clientX, y: e.clientY });
        setSelecting(true);
        setBox(null);
    };

    const handleMouseMove = (e) => {
        if (!selecting || !start) return;

        const x1 = Math.min(start.x, e.clientX);
        const y1 = Math.min(start.y, e.clientY);
        const x2 = Math.max(start.x, e.clientX);
        const y2 = Math.max(start.y, e.clientY);

        setBox({
            left: x1,
            top: y1,
            width: x2 - x1,
            height: y2 - y1,
        });
    };

    const handleMouseUp = async () => {
        setSelecting(false);

        if (!box) {
            setStart(null); // ✅ Reset lại start trong trường hợp không có box
            return;
        }

        const rootEl = document.getElementById('root'); // Hoặc dùng phần tử bao chứa chính của bạn

        const canvas = await html2canvas(rootEl, {
            x: box.left + window.scrollX,
            y: box.top + window.scrollY,
            width: box.width,
            height: box.height,
            scrollX: window.scrollX,
            scrollY: window.scrollY,
            windowWidth: document.documentElement.scrollWidth,
            windowHeight: document.documentElement.scrollHeight,
            useCORS: true,
        });

        const image = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = image;
        link.download = `screenshot-${Date.now()}.png`;
        link.click();

        setBox(null);
    };

    useEffect(() => {
        if (selecting) {
            document.body.style.userSelect = 'none';
        } else {
            document.body.style.userSelect = '';
        }
    }, [selecting]);

    return (
        <div className="image-page">
            <button onClick={() => {
                setStart(null);     // reset điểm bắt đầu
                setBox(null);       // reset box chọn cũ
                setSelecting(true); // bắt đầu lại
            }}>Cắt ảnh</button>

            {selecting && (
                <div
                    ref={overlayRef}
                    className="snip-overlay"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    {box && (
                        <div
                            className="selection-box"
                            style={{
                                left: box.left,
                                top: box.top,
                                width: box.width,
                                height: box.height,
                            }}
                        />
                    )}
                </div>
            )}

            {/* Nội dung trang demo */}
            <div className="content-to-capture">
                <h1>Trang ImagePage</h1>
                <p>Đây là nội dung mà bạn sẽ cắt bằng chuột.</p>
                <img src="/images/image.png" alt="mèo dễ thương" />
            </div>
        </div>
    );
};

export default ImagePage;
