import { NextResponse } from 'next/server';

export function GET() {
  // Some environments/devtools request /favicon.ico.
  // Returning an empty 204 avoids noisy console 404s.
  return new NextResponse(null, { status: 204 });
}

