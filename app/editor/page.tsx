'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';

interface ImageFile {
    id: string;
    file: File;
    preview: string;
    optimized?: Blob;
    isProcessing?: boolean;
}

export default function EditorPage() {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter((f) =>
            f.type.startsWith('image/')
        );
        addImages(files);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addImages(Array.from(e.target.files));
        }
    };

    const addImages = (files: File[]) => {
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + Math.random().toString(),
                        file,
                        preview: e.target?.result as string,
                    },
                ]);
            };
            reader.readAsDataURL(file);
        });
    };

    const optimizeImages = async () => {
        setIsOptimizing(true);
        const optimized = await Promise.all(
            images.map(async (img) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                const image = new Image();
                image.src = img.preview;

                return new Promise<ImageFile>((resolve) => {
                    image.onload = async () => {
                        let { width, height } = image;
                        const maxDim = 3999;
                        if (width > maxDim || height > maxDim) {
                            const ratio = Math.min(maxDim / width, maxDim / height);
                            width *= ratio;
                            height *= ratio;
                        }
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(image, 0, 0, width, height);

                        canvas.toBlob(
                            (blob) => {
                                resolve({ ...img, optimized: blob! });
                            },
                            'image/avif',
                            0.65
                        );
                    };
                });
            })
        );
        setImages(optimized);
        setIsOptimizing(false);
    };

    const downloadImage = async (img: ImageFile) => {
        if (!img.optimized) return;
        const url = URL.createObjectURL(img.optimized);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${img.file.name.split('.')[0]}.avif`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadAllImages = async () => {
        const zip = new JSZip();
        images.forEach((img) => {
            if (img.optimized) {
                zip.file(`${img.file.name.split('.')[0]}.avif`, img.optimized);
            }
        });
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `optimized_images.zip`;
        a.click();
        URL.revokeObjectURL(url);
    }
 
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8">Photo Optimizer</h1>

                <div
                    ref={dropZoneRef}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-blue-400 rounded-lg p-8 text-center cursor-pointer hover:bg-slate-700/50 transition mb-8"
                >
                    <p className="text-white mb-4">Drag and drop images here</p>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                        <span className="text-blue-400 hover:underline">or click to browse</span>
                    </label>
                </div>

                {images.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                            {images.map((img) => (
                                <div key={img.id} className="relative group">
                                    <img
                                        src={img.preview}
                                        alt="preview"
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                    {img.optimized && (
                                        <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                                            <span className="text-green-300 font-semibold">✓</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={optimizeImages}
                                disabled={isOptimizing}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                            >
                                {isOptimizing ? 'Optimizing...' : 'Optimize'}
                            </button>

                            {images.some((img) => img.optimized) && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={downloadAllImages}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                                    >
                                        Download All
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}