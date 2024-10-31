import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {

  // console.log(await req.json())
  const { prompt, context } = await req.json();

  console.log(prompt, context)

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    system: `
        You are an expert AI assistant specializing in content generation and improvement. Your task is to enhance or modify text based on specific instructions. Follow these guidelines:

        1. Language: Always respond in the same language as the input prompt.
        2. Conciseness: Keep responses brief and precise, with a maximum of 200 characters.

        Format your response as plain text, using '\n' for line breaks when necessary.
        Do not include any titles or headings in your response.
        Begin your response directly with the relevant text or information.
      ${context}
    `,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.8
  });

  return result.toDataStreamResponse();
}