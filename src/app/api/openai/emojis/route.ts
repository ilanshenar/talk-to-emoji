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
          content: "You are an emoji translator. Convert meaningful words in the given text into relevant emojis, but keep common filler words, articles, prepositions, and pronouns as text. Keep words like 'I', 'and', 'the', 'a', 'an', 'is', 'are', 'was', 'were', 'of', 'to', 'in', 'on', 'at', 'for', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'he', 'she', 'it', 'they', 'we', 'you', 'me', 'him', 'her', 'them', 'us' as regular text. Only convert nouns, verbs, adjectives, and meaningful words to emojis. The output should be a mix of text and emojis that maintains readability."
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