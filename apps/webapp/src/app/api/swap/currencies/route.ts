import { NextResponse } from 'next/server';
import { CURRENCY_MAP, SUPPORTED_TICKERS } from '@workspace/commons/currency-map';
import { CurrencyDto } from '@workspace/commons/dtos/change-now/currency.dto';

export async function GET() {
  const currencies: CurrencyDto[] = SUPPORTED_TICKERS.map((canonical) => ({
    canonicalTicker: canonical,
    label: CURRENCY_MAP[canonical].label,
    image: CURRENCY_MAP[canonical].image,
    network: CURRENCY_MAP[canonical].network,
    buy: true,
    sell: true,
  }));
  return NextResponse.json(currencies, {
    headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=60' },
  });
}
