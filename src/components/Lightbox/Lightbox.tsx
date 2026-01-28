// src/components/Lightbox.tsx
'use client';
import { useEffect, useState } from 'react';

interface LightboxProps {
    images: Array<{ src: string; alt: string }>;
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function Lightbox({ images, currentIndex, onClose, onNext, onPrev }: LightboxProps) {
    const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') {
                setDirection('next');
                setTimeout(() => setDirection(null), 50);
                onNext();
            }
            if (e.key === 'ArrowLeft') {
                setDirection('prev');
                setTimeout(() => setDirection(null), 50);
                onPrev();
            }
        };

        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = 'unset';
        };
    }, [onClose, onNext, onPrev]);

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const imageWidth = rect.width;

        if (clickX < imageWidth / 3) {
            setDirection('prev');
            setTimeout(() => setDirection(null), 50);
            onPrev();
        } else if (clickX > (imageWidth * 2) / 3) {
            setDirection('next');
            setTimeout(() => setDirection(null), 50);
            onNext();
        }
    };

    const onTouchStart = (e: React.TouchEvent<HTMLImageElement>) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent<HTMLImageElement>) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            setDirection('next');
            setTimeout(() => setDirection(null), 50);
            onNext();
        }
        if (isRightSwipe) {
            setDirection('prev');
            setTimeout(() => setDirection(null), 50);
            onPrev();
        }
    };

    const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setDirection('prev');
        setTimeout(() => setDirection(null), 50);
        onPrev();
    };

    const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setDirection('next');
        setTimeout(() => setDirection(null), 50);
        onNext();
    };

    const currentImage = images[currentIndex];

    const getTransitionStyle = () => {
        if (direction === 'next') {
            return { opacity: 0, transform: 'translateX(20px)' };
        }
        if (direction === 'prev') {
            return { opacity: 0, transform: 'translateX(-20px)' };
        }
        return { opacity: 1, transform: 'translateX(0)' };
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 text-white text-4xl hover:opacity-70 transition-opacity z-10"
                onClick={onClose}
            >
                ×
            </button>

            {/* Desktop arrows - hidden on mobile */}
            <button
                className="hidden md:block absolute left-4 text-white text-4xl hover:opacity-70 transition-opacity z-10"
                onClick={handlePrev}
            >
                ←
            </button>

            <button
                className="hidden md:block absolute right-4 text-white text-4xl hover:opacity-70 transition-opacity z-10"
                onClick={handleNext}
            >
                →
            </button>

            <img
                key={currentIndex}
                src={currentImage.src}
                alt={currentImage.alt}
                className="max-w-[90%] max-h-[90%] object-contain select-none cursor-pointer"
                style={{
                    ...getTransitionStyle(),
                    transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
                }}
                onClick={handleImageClick}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            />

            <div className="absolute bottom-4 text-white text-sm">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
}