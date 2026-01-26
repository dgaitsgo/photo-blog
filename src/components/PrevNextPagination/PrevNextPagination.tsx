function PrevNextPagination({ post }: { post: any }) {
    return (
        <div className='flex justify-between mt-16 mb-16'>
            <div>
                {post.nextData &&
                    <a href={`/post/${post.nextData.slug}`}
                        className="inline-flex items-center font-medium text-gray-800 dark:text-white hover:underline">
                        <div className='md:text-lg flex items-center gap-6 gap-1 lg:text-2xl font-semibold'>
                            <svg className="w-4 h-4 lg:w-6 lg:h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"></path>
                            </svg>
                            <span>
                                {post.nextData.title}
                            </span>
                        </div>
                    </a>}
            </div>
            {post.prevData &&
                <a href={`/post/${post.prevData.slug}`}
                    className="inline-flex items-center font-medium text-gray-800 dark:text-white hover:underline">
                    <div className='md:text-lg flex items-center lg:gap-6 gap-1 lg:text-2xl font-semibold'>
                        <span>
                            {post.prevData.title}
                        </span>
                        <svg className="w-4 h-4 lg:w-6 lg:h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"></path>
                        </svg>
                    </div>
                </a>
            }
        </div>
    )
}

export default PrevNextPagination;