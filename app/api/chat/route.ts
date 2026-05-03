// This API route is no longer used.
// Chat requests now go directly to the Go backend via the Next.js proxy rewrite.
// See next.config.mjs: /api/v1/* → http://localhost:8080/api/v1/*

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Chat has been moved to the Go backend. Use /api/v1/chat instead.' },
    { status: 410 }
  );
}
