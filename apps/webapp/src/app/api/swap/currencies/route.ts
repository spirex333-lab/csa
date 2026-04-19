import { NextResponse } from 'next/server';

const API_BASE = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:8002/api';

const ALLOWED_TICKERS = new Set(['btc', 'eth', 'usdt', 'bnb', 'sol', 'xrp']);

export async function GET() {
  const res = await fetch(`${API_BASE}/change-now/currencies`, {
    next: { revalidate: 900 },
  });
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch currencies' }, { status: res.status });
  const data: { ticker: string }[] = await res.json();
  const filtered = data.filter((c) => ALLOWED_TICKERS.has(c.ticker.toLowerCase()));
  return NextResponse.json(filtered, {
    headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=60' },
  });
}
