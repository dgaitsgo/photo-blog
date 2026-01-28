'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Gallery {
    title: string;
    id: string;
    images: Array<{
        img: string;
        caption?: string;
    }>;
}

interface PostData {
    title: string;
    excerpt: string;
    cardCover: string;
    date: string;
    location: string;
    tags: string[];
    galleries: Gallery[];
}

export default function EditorPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<{ slug: string; title: string }[]>([]);
    const [selectedPost, setSelectedPost] = useState<string | null>(null);
    const [formData, setFormData] = useState<PostData | null>(null);
    const [markdown, setMarkdown] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts')
            const data = await response.json()
            setPosts(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            setLoading(false);
        }
    };

    const loadPost = async (slug: string) => {
        try {
            const response = await fetch(`/api/posts/${slug}`);
            const data = await response.json();
            console.log('Loaded post data:', data);
            setSelectedPost(slug);
            setFormData({...data});
            setMarkdown(data.content);
        } catch (error) {
            console.error('Failed to load post:', error);
        }
    };

    const handleNew = () => {
        const newPost: PostData = {
            title: '',
            excerpt: '',
            cardCover: '',
            date: new Date().toISOString(),
            location: '',
            tags: [],
            galleries: [],
        };
        setSelectedPost(null);
        setFormData(newPost);
        setMarkdown('');
    };

    const handleDelete = async () => {
        if (!selectedPost || !window.confirm('Are you sure? This cannot be undone.')) return;

        try {
            await fetch(`/api/posts/${selectedPost}`, { method: 'DELETE' });
            setSelectedPost(null);
            setFormData(null);
            setMarkdown('');
            await fetchPosts();
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const handleSave = async () => {
        if (!formData) return;

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: selectedPost,
                    frontmatter: formData,
                    markdown,
                }),
            });

            if (response.ok) {
                await fetchPosts();
                alert('Post saved successfully!');
            }
        } catch (error) {
            console.error('Failed to save post:', error);
            alert('Failed to save post');
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="flex h-screen gap-4 bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-4 space-y-2">
                    <button
                        onClick={handleNew}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 font-medium"
                    >
                        + New Post
                    </button>
                    {selectedPost && (
                        <button
                            onClick={handleDelete}
                            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 font-medium"
                        >
                            Delete Post
                        </button>
                    )}
                </div>
                <div className="border-t border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Posts</h3>
                    <ul className="space-y-1">
                        {posts.map(({ slug, title }) => (
                            <li key={slug}>
                                <button
                                    onClick={() => loadPost(slug)}
                                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                                        selectedPost === slug 
                                            ? 'bg-blue-100 text-blue-900 font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            {formData && (
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-4xl mx-auto p-6 space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {selectedPost ? 'Edit Post' : 'New Post'}
                            </h2>

                            {/* Form Fields */}
                            <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Excerpt
                                    </label>
                                    <textarea
                                        value={formData.excerpt}
                                        onChange={(e) =>
                                            setFormData({ ...formData, excerpt: e.target.value })
                                        }
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Card Cover
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.cardCover}
                                            onChange={(e) =>
                                                setFormData({ ...formData, cardCover: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) =>
                                                setFormData({ ...formData, location: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tags.join(', ')}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tags: e.target.value
                                                    .split(',')
                                                    .map((t) => t.trim())
                                                    .filter(Boolean),
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Markdown Content
                                    </label>
                                    <textarea
                                        value={markdown}
                                        onChange={(e) => setMarkdown(e.target.value)}
                                        rows={8}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 font-medium"
                            >
                                Save Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}