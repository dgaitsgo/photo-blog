import { NextRequest, NextResponse } from 'next/server';
import { findSeasonYearPathBySlug, getPostBySlug } from 'src/api';
// import { getItemsFromDatabase } from '@/lib/database'; // Example helper function

export async function GET(request: NextRequest, { params }: { params: any}) {
    const _params = await params
    const post = getPostBySlug(findSeasonYearPathBySlug(_params.slug))
    return NextResponse.json(post)
}