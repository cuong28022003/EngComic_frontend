import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import './styles.scss'; // Đừng quên import CSS

const SnippingPage = () => {
    const imageUrl ="/images/image.png"; // Đường dẫn đến hình ảnh bạn muốn snip
    const containerRef = useRef(null);
    const [start, setStart] = useState(null);
    const [box, setBox] = useState(null);

    const handleMouseDown = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        setStart({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const handleMouseMove = (e) => {
        if (!start) return;
        const rect = containerRef.current.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const x1 = Math.min(start.x, x);
        const y1 = Math.min(start.y, y);
        const x2 = Math.max(start.x, x);
        const y2 = Math.max(start.y, y);

        setBox({
            left: x1,
            top: y1,
            width: x2 - x1,
            height: y2 - y1,
        });
    };

    const handleMouseUp = async () => {
        if (!box) return;

        const canvas = await html2canvas(containerRef.current, {
            x: box.left,
            y: box.top,
            width: box.width,
            height: box.height,
            useCORS: true,
            backgroundColor: null,
        });

        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'snipped-image.png';
        link.click();

        // reset selection
        setBox(null);
        setStart(null);
    };

    return (
        <div className="snipping-wrapper">
            <div
                className="snipping-container"
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <img src={imageUrl} alt="For Snipping" className="snipping-image" />
                {box && (
                    <div
                        className="snipping-selection-box"
                        style={{
                            left: box.left,
                            top: box.top,
                            width: box.width,
                            height: box.height,
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default SnippingPage;
