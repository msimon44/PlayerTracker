'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface MousePosition {
    x: number;
    y: number;
}

function MousePosition(): MousePosition {
    const [mousePosition, setMousePosition] = useState<MousePosition>({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return mousePosition;
}

interface ParticlesProps {
    className?: string;
    quantity?: number;
    staticity?: number;
    ease?: number;
    size?: number;
    refresh?: boolean;
    color?: string;
    vx?: number;
    vy?: number;
}

function hexToRgb(hex: string): number[] {
    hex = hex.replace('#', '');
    const hexInt = parseInt(hex, 16);
    const red = (hexInt >> 16) & 255;
    const green = (hexInt >> 8) & 255;
    const blue = hexInt & 255;
    return [red, green, blue];
}

const Particles: React.FC<ParticlesProps> = ({
    className = '',
    quantity = 100,
    staticity = 50,
    ease = 50,
    size = 0.4,
    refresh = false,
    color = '#ffffff',
    vx = 0,
    vy = 0,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const context = useRef<CanvasRenderingContext2D | null>(null);
    const circles = useRef<any[]>([]);
    const mousePosition = MousePosition();
    const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
    const rgb = hexToRgb(color);

    type Circle = {
        x: number;
        y: number;
        translateX: number;
        translateY: number;
        size: number;
        alpha: number;
        targetAlpha: number;
        dx: number;
        dy: number;
        magnetism: number;
    };

    const circleParams = useCallback((): Circle => {
        const x = Math.floor(Math.random() * canvasSize.current.w);
        const y = Math.floor(Math.random() * canvasSize.current.h);
        const translateX = 0;
        const translateY = 0;
        const pSize = Math.floor(Math.random() * 2) + size;
        const alpha = 0;
        const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
        const dx = (Math.random() - 0.5) * 0.1;
        const dy = (Math.random() - 0.5) * 0.1;
        const magnetism = 0.1 + Math.random() * 4;
        return {
            x,
            y,
            translateX,
            translateY,
            size: pSize,
            alpha,
            targetAlpha,
            dx,
            dy,
            magnetism,
        };
    }, [size]);

    const drawCircle = useCallback(
        (circle: Circle, update = false) => {
            if (context.current) {
                const { x, y, translateX, translateY, size, alpha } = circle;
                context.current.translate(translateX, translateY);
                context.current.beginPath();
                context.current.arc(x, y, size, 0, 2 * Math.PI);
                context.current.fillStyle = `rgba(${rgb.join(', ')}, ${alpha})`;
                context.current.fill();
                context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

                if (!update) {
                    circles.current.push(circle);
                }
            }
        },
        [dpr, rgb],
    );

    const clearContext = useCallback(() => {
        if (context.current) {
            context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
        }
    }, []);

    const drawParticles = useCallback(() => {
        clearContext();
        const particleCount = quantity;
        for (let i = 0; i < particleCount; i++) {
            const circle = circleParams();
            drawCircle(circle);
        }
    }, [quantity, clearContext, circleParams, drawCircle]);

    const resizeCanvas = useCallback(() => {
        if (canvasContainerRef.current && canvasRef.current && context.current) {
            circles.current.length = 0;
            canvasSize.current.w = canvasContainerRef.current.offsetWidth;
            canvasSize.current.h = canvasContainerRef.current.offsetHeight;
            canvasRef.current.width = canvasSize.current.w * dpr;
            canvasRef.current.height = canvasSize.current.h * dpr;
            canvasRef.current.style.width = `${canvasSize.current.w}px`;
            canvasRef.current.style.height = `${canvasSize.current.h}px`;
            context.current.scale(dpr, dpr);
        }
    }, [dpr]);

    const initCanvas = useCallback(() => {
        resizeCanvas();
        drawParticles();
    }, [resizeCanvas, drawParticles]);

    const onMouseMove = useCallback(() => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const { w, h } = canvasSize.current;
            const x = mousePosition.x - rect.left - w / 2;
            const y = mousePosition.y - rect.top - h / 2;
            const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
            if (inside) {
                mouse.current.x = x;
                mouse.current.y = y;
            }
        }
    }, [mousePosition.x, mousePosition.y]);

    const isCircleInBounds = useCallback((circle: Circle): boolean => {
        const { x, y, size } = circle;
        return x + size >= 0 && x - size <= canvasSize.current.w && y + size >= 0 && y - size <= canvasSize.current.h;
    }, []);

    const replaceOutOfBoundsCircle = useCallback(
        (index: number) => {
            const newCircle = circleParams();
            circles.current[index] = newCircle;
        },
        [circleParams],
    );

    const animate = useCallback(() => {
        clearContext();
        circles.current.forEach((circle: Circle, i: number) => {
            // Handle circle movement
            circle.x += circle.dx + vx;
            circle.y += circle.dy + vy;

            // Check if circle is out of bounds
            if (!isCircleInBounds(circle)) {
                replaceOutOfBoundsCircle(i);
            }

            // Handle mouse interaction
            const { x: mouseX, y: mouseY } = mouse.current;
            const distance = Math.sqrt(Math.pow(circle.x - mouseX, 2) + Math.pow(circle.y - mouseY, 2));
            const maxDistance = 100;
            if (distance < maxDistance) {
                const angle = Math.atan2(mouseY - circle.y, mouseX - circle.x);
                const force = (maxDistance - distance) / maxDistance;
                circle.translateX += Math.cos(angle) * force * circle.magnetism * (staticity / 100);
                circle.translateY += Math.sin(angle) * force * circle.magnetism * (staticity / 100);
            }

            // Apply easing to translations
            circle.translateX *= ease / 100;
            circle.translateY *= ease / 100;

            // Update alpha
            circle.alpha += (circle.targetAlpha - circle.alpha) * 0.1;

            drawCircle(circle, true);
        });
        window.requestAnimationFrame(animate);
    }, [clearContext, drawCircle, isCircleInBounds, replaceOutOfBoundsCircle, vx, vy, staticity, ease]);

    useEffect(() => {
        if (canvasRef.current) {
            context.current = canvasRef.current.getContext('2d');
        }
        initCanvas();
        animate();
        window.addEventListener('resize', initCanvas);

        return () => {
            window.removeEventListener('resize', initCanvas);
        };
    }, [color, initCanvas, animate]);

    useEffect(() => {
        onMouseMove();
    }, [mousePosition.x, mousePosition.y, onMouseMove]);

    useEffect(() => {
        initCanvas();
    }, [refresh, initCanvas]);

    return (
        <div
            className={className}
            ref={canvasContainerRef}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                background: 'transparent',
                pointerEvents: 'none',
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                }}
            />
        </div>
    );
};

export default Particles;
