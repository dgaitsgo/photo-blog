'use client';
import { useRef, useState, useEffect } from 'react'
import Gallery from 'src/components/Gallery'
import Lightbox from 'src/components/Lightbox'

export default function BlogContentClient({ post }: { post: any }) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [allImages, setAllImages] = useState<{ src: string; alt: string; id: string }[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!contentRef.current) return;

        // Read ALL images from the DOM and assign IDs
        const images = Array.from(contentRef.current.querySelectorAll('img')).map((img, i) => ({
            src: img.src,
            alt: img.alt,
            id: `img-${i + 1}`
        }))

        setAllImages(images)

        // Check URL hash on mount to open lightbox
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const index = images.findIndex(img => img.id === hash);
            if (index !== -1) {
                setLightboxIndex(index);
            }
        }

        // Single click handler for the entire container
        const handleClick = (e: MouseEvent) => {
            if ((e.target as HTMLElement).tagName === 'IMG') {
                const index = images.findIndex(img => img.src === (e.target as HTMLImageElement).src)
                if (index !== -1) {
                    const imageId = images[index].id;
                    window.history.pushState(null, '', `#${imageId}`);
                    setLightboxIndex(index);
                }
            }
        };

        contentRef.current.addEventListener('click', handleClick);

        // Make all images clickable
        contentRef.current.querySelectorAll('img').forEach(img => {
            img.style.cursor = 'pointer'
        })

        return () => {
            contentRef.current?.removeEventListener('click', handleClick);
        };
    }, [post.parts, post.galleries])

    // Handle browser back/forward
    useEffect(() => {
        const handlePopState = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                const index = allImages.findIndex(img => img.id === hash);
                setLightboxIndex(index !== -1 ? index : null);
            } else {
                setLightboxIndex(null);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [allImages]);

    const handleClose = () => {
        setLightboxIndex(null);
        window.history.pushState(null, '', window.location.pathname);
    };

    const handleNext = () => {
        const newIndex = (lightboxIndex! + 1) % allImages.length;
        setLightboxIndex(newIndex);
        window.history.pushState(null, '', `#${allImages[newIndex].id}`);
    };

    const handlePrev = () => {
        const newIndex = (lightboxIndex! - 1 + allImages.length) % allImages.length;
        setLightboxIndex(newIndex);
        window.history.pushState(null, '', `#${allImages[newIndex].id}`);
    };

    const parts = post.content.split(/{{gallery}}/g)

    return (
        <>
            <div ref={contentRef} className=''>
                {parts.map((part: string, i: number) => (
                    <div key={i}>
                        <div className='prose max-w-12xl mx-auto width-full article-content' dangerouslySetInnerHTML={{ __html: part }} />
                        {post.galleries?.[i] && (
                            <Gallery
                                gallery={post.galleries[i]}
                            />
                        )}
                    </div>
                ))}
            </div>
            {lightboxIndex !== null && (
                <Lightbox
                    images={allImages}
                    currentIndex={lightboxIndex}
                    onClose={handleClose}
                    onNext={handleNext}
                    onPrev={handlePrev}
                />
            )}
        </>
    );
}