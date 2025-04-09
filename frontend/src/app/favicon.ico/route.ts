import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  // Emoji favicon
  const emojiText = '🐶';

  return new NextResponse(emojiText, {
    headers: {
      'Content-Type': 'image/x-icon',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
