import React, { useState } from 'react';
import SnippingOverlay from './SnippingPage/SnippingOverlay';
import './styles.scss';

const SnippingTool = () => {
    const [active, setActive] = useState(false);

    const handleComplete = (image) => {
        downloadImage(image);
        setActive(false);
    };

    const handleCancel = () => {
        setActive(false);
    };

    const downloadImage = (dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `screenshot-${Date.now()}.png`;
        link.click();
    };

    return (
        <div>
            <button onClick={() => setActive(true)} className="snipping-button">
                Bắt đầu cắt ảnh
            </button>

            {active && <SnippingOverlay onComplete={handleComplete} onCancel={handleCancel} />}
        </div>
    );
};

export default SnippingTool;
