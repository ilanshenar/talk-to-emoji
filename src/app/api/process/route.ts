import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      console.error('No text provided');
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    console.log('Converting text to emojis:', text);

    // Convert text to emojis using GPT
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an emoji translator. Convert the given text into a sequence of relevant emojis. Keep the emojis as close to the original meaning as possible."
        },
        {
          role: "user",
          content: text
        }
      ],
    });

    const emojis = completion.choices[0].message.content;
    console.log('Emoji conversion result:', emojis);

    return NextResponse.json({ emojis });
  } catch (error) {
    console.error('Error converting text to emojis:', error);
    return NextResponse.json({ error: 'Failed to convert text to emojis' }, { status: 500 });
  }
} 