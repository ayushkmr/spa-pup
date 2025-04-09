import { NextResponse } from 'next/server';

export async function GET() {
  // Emoji favicon
  const emojiText = '🐶';
  
  return new NextResponse(emojiText, {
    headers: {
      'Content-Type': 'image/x-icon',
    },
  });
}
