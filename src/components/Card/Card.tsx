'use client'

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './Card.module.css'

function Card({ title, date, excerpt, location, tags, cardCover, articlePath }:
    {
        title: string; date: string; excerpt: string, location: string, tags: string[], cardCover: string, articlePath : string
    }) {

    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    const dateString = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div
            ref={cardRef}
            className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            style={{ transitionDelay: `${0}ms` }}
        >
            <div className={styles['blog-item']}>
                <div className={styles['img-wrapper']}>
                    <a href={articlePath}>
                        <Image className={styles['img-yo']} width={1080} height={500} src={cardCover} alt={'cover image'} />
                    </a>
                </div>
                <div className={styles['card-text']}>
                    <div className='text-sm text-body mb-1'>
                        {dateString}
                    </div>
                    <div className='font-bold text-xl mb-2'>
                        {title}
                    </div>
                    <div className='text-gray-700 text-base mb-4'>
                        {excerpt}
                    </div>
                    {location &&
                        <div className='mb-2'>
                            {location}
                        </div>
                    }
                    <a href={articlePath} className='text-blue-500 hover:text-blue-700 mb-4 inline-block'>
                        more
                    </a>
                    <div >
                        {tags.map((tag, i) =>
                            <span
                                key={i}
                                className='inline-block bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
                                #{tag}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card