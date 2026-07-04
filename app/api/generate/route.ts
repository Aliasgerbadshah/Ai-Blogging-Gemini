import { NextResponse } from 'next/server';
import { AIBlogEngine } from '@/lib/ai-engine';

export async function POST(request: Request) {
  try {
    const { keyword, apiKey, modelName } = await request.json();

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    // Use provided API key or environment variable
    const finalApiKey = apiKey || process.env.GEMINI_API_KEY;

    if (!finalApiKey) {
      return NextResponse.json({ error: 'Gemini API Key is required' }, { status: 400 });
    }

    const engine = new AIBlogEngine(finalApiKey, modelName || 'gemini-1.5-pro');
    const blogPost = await engine.generateBlog(keyword);

    return NextResponse.json(blogPost);
  } catch (error: any) {
    console.error('Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
