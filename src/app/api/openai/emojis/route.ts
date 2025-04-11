import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // Convert text to emojis using GPT-4o-mini
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an emoji translator. Convert the given text into a sequence of relevant emojis. Keep the emojis as close to the original meaning as possible. Use only emojis in your response, no text."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    const emojis = completion.choices[0].message.content;

    return NextResponse.json({ emojis });
  } catch (error) {
    console.error('Error converting text to emojis:', error);
    return NextResponse.json({ error: 'Failed to convert text to emojis' }, { status: 500 });
  }
} 