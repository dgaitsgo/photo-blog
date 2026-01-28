import { NextRequest, NextResponse } from 'next/server';
import { title } from 'process';
import { getAllPostsChronological } from 'src/api';
// import { getItemsFromDatabase } from '@/lib/database'; // Example helper function

export async function GET(request: NextRequest) {
    const posts = getAllPostsChronological()
    return NextResponse.json(posts.map(post => ({ slug: post.slug, title: post.title }))); // Returns a JSON response with status 200
}