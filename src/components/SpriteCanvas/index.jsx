import React, { useRef, useEffect, useState } from 'react';
import './styles.scss';

/**
 * SpriteCanvas - Reusable sprite animation component
 * 
 * @param {Object} props
 * @param {string} props.imageSrc - Path to sprite sheet image
 * @param {number} props.width - Canvas width (default: 200)
 * @param {number} props.height - Canvas height (default: 200)
 * @param {number} props.scale - Sprite scale (default: 1)
 * @param {number} props.framesMax - Total frames in sprite sheet (default: 1)
 * @param {number} props.framesHold - Frames to hold before advancing (default: 5)
 * @param {Object} props.position - Position {x, y} (default: {x: 0, y: 0})
 * @param {Object} props.offset - Offset {x, y} for drawing (default: {x: 0, y: 0})
 * @param {number} props.facing - 1 for right, -1 for left (default: 1)
 * @param {boolean} props.animate - Enable/disable animation (default: true)
 * @param {boolean} props.loop - Loop animation (default: true)
 * @param {Function} props.onAnimationComplete - Callback when animation completes
 * @param {string} props.className - Additional CSS class
 */
const SpriteCanvas = ({
    imageSrc,
    width = 200,
    height = 200,
    scale = 1,
    framesMax = 1,
    framesHold = 5,
    position = { x: 0, y: 0 },
    offset = { x: 0, y: 0 },
    facing = 1,
    animate = true,
    loop = true,
    onAnimationComplete,
    className = ''
}) => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const imageRef = useRef(null);
    const frameCurrentRef = useRef(0);
    const framesElapsedRef = useRef(0);

    // Load image
    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            imageRef.current = img;
            setImageLoaded(true);
        };
        img.onerror = () => {
            console.error(`Failed to load sprite image: ${imageSrc}`);
        };
        img.src = imageSrc;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [imageSrc]);

    // Animation loop
    useEffect(() => {
        if (!imageLoaded || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const c = canvas.getContext('2d');
        const img = imageRef.current;

        const draw = () => {
            // Clear canvas
            c.clearRect(0, 0, canvas.width, canvas.height);

            const frameWidth = img.width / framesMax;
            const dw = frameWidth * scale;
            const dh = img.height * scale;
            const drawX = position.x - offset.x;
            const drawY = position.y - offset.y;

            if (facing === -1) {
                // Draw flipped (facing left)
                c.save();
                c.scale(-1, 1);
                c.drawImage(
                    img,
                    frameCurrentRef.current * frameWidth,
                    0,
                    frameWidth,
                    img.height,
                    -(drawX + dw),
                    drawY,
                    dw,
                    dh
                );
                c.restore();
            } else {
                // Draw normal (facing right)
                c.drawImage(
                    img,
                    frameCurrentRef.current * frameWidth,
                    0,
                    frameWidth,
                    img.height,
                    drawX,
                    drawY,
                    dw,
                    dh
                );
            }
        };

        const animateFrames = () => {
            if (!animate) return;

            framesElapsedRef.current++;

            if (framesElapsedRef.current % framesHold === 0) {
                if (frameCurrentRef.current < framesMax - 1) {
                    frameCurrentRef.current++;
                } else {
                    if (loop) {
                        frameCurrentRef.current = 0;
                    } else {
                        // Animation completed
                        if (onAnimationComplete) {
                            onAnimationComplete();
                        }
                        return; // Stop animation
                    }
                }
            }
        };

        const update = () => {
            draw();
            animateFrames();
            animationFrameRef.current = requestAnimationFrame(update);
        };

        update();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [
        imageLoaded,
        scale,
        framesMax,
        framesHold,
        position.x,
        position.y,
        offset.x,
        offset.y,
        facing,
        animate,
        loop,
        onAnimationComplete
    ]);

    // Reset animation when key props change
    useEffect(() => {
        frameCurrentRef.current = 0;
        framesElapsedRef.current = 0;
    }, [imageSrc, framesMax]);

    return (
        <div className={`sprite-canvas-container ${className}`}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="sprite-canvas"
            />
        </div>
    );
};

export default SpriteCanvas;
