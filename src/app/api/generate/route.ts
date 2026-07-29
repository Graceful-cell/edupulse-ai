import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tool, topic, grade } = body;

    if (!topic || !grade) {
      return NextResponse.json({ error: 'Topic and Grade are required.' }, { status: 400 });
    }

    const promptText = `Create a detailed ${tool || 'lesson plan'} for grade/level "${grade}" on the topic: "${topic}". Use clear Markdown formatting with headings and bullet points.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(promptText);
    const text = response.response.text();

    return NextResponse.json({ result: text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
  }
