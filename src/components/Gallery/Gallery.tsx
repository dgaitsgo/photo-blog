import styles from './Gallery.module.css'

interface GalleryType {
    title: string,
    id: string,
    images: [{
        img: string,
        caption?: string
    }]
}

function Gallery({ gallery }: { gallery: GalleryType }) {

    const gridType = gallery.images.length > 2 ? 'masonry' : 'grid grid-cols-2 gap-4'

    return (
        <div className={gridType}>
            {gallery.images.map(img => {
                return (
                    <div>
                        <img className={`${styles['grid-img']} h-auto max-w-full rounded-base`} src={img.img} alt={img.caption} />
                        {img.caption && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{img.caption}</p>}
                    </div>
                )
            })}
        </div>
    )
}

export default Gallery