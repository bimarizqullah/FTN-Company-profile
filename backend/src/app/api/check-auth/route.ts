// src/app/api/check-auth/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ success: true })
}
