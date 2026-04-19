import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:8002/api';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get('type') ?? 'float';
  searchParams.delete('type');

  const endpoint = type === 'fixed' ? 'quote/fixed' : 'quote/float';
  const res = await fetch(`${API_BASE}/change-now/${endpoint}?${searchParams.toString()}`);
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch quote' }, { status: res.status });
  const data = await res.json();
  return NextResponse.json(data);
}
