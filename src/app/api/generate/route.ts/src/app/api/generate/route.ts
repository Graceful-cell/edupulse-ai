import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const PROMPTS = {
  lesson: (topic: string, grade: string) => `
    Create a comprehensive 45-minute lesson plan for grade/level ${grade} on the topic: "${topic}".
    Format clearly using Markdown headings, bold text, and bullet points:
    - **Learning Objectives**
    - **Required Materials**
    - **Lesson Structure** (Hook, Direct Instruction, Guided Practice, Independent Practice)
    - **Assessment & Exit Ticket**
  `,
  rubric: (topic: string, grade: string) => `
    Create an assessment rubric for grade/level ${grade} for an assignment on "${topic}".
    Format as a clear Markdown table with criteria and 4 achievement levels.
  `,
  parent_email: (topic: string, grade: string) => `
    Draft a polite, supportive, and clear email to a parent regarding: "${topic}" (Grade context: ${grade}).
    Include placeholder brackets where appropriate.
  `,
  differentiation: (topic: string, grade: string) => `
    Provide 3-tiered differentiation strategies (Approaching Level, On Level, Advanced/Enrichment) 
    for teaching the topic "${topic}" to grade level ${grade}.
  `
};

export async function POST(req: Request) {
  try {
    const { tool, topic, grade } = await req.json();

    if (!topic || !grade || !PROMPTS[tool as keyof typeof PROMPTS]) {
      return NextResponse.json({ error: 'Invalid parameters provided.' }, { status: 400 });
    }

    const promptText = PROMPTS[tool as keyof typeof PROMPTS](topic, grade);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const response = await model.generateContent(promptText);
    const text = response.response.text();

    return NextResponse.json({ result: text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
  }
