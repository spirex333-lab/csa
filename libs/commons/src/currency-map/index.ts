/**
 * Canonical ticker keys used throughout the app.
 * Each entry maps to provider-specific codes for ChangeNow and ff.io.
 *
 * changenow: { ticker, network? }  — network only needed for multi-network coins
 * ffio:      { code }              — ff.io's unique currency code
 */
export interface CurrencyMapEntry {
  label: string;
  image: string;
  /** Human-readable network name shown in UI (e.g. "Ethereum", "Tron") */
  network: string;
  changenow: { ticker: string; network?: string };
  ffio: { code: string };
}

const CDN = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color';

export const CURRENCY_MAP: Record<string, CurrencyMapEntry> = {
  BTC: {
    label: 'BTC',
    image: `${CDN}/btc.svg`,
    network: 'Bitcoin',
    changenow: { ticker: 'btc' },
    ffio: { code: 'BTC' },
  },
  ETH: {
    label: 'ETH',
    image: `${CDN}/eth.svg`,
    network: 'Ethereum',
    changenow: { ticker: 'eth' },
    ffio: { code: 'ETH' },
  },
  USDT_ERC20: {
    label: 'USDT (ERC20)',
    image: `${CDN}/usdt.svg`,
    network: 'Ethereum',
    changenow: { ticker: 'usdt', network: 'eth' },
    ffio: { code: 'USDT' },
  },
  USDT_TRC20: {
    label: 'USDT (TRC20)',
    image: `${CDN}/usdt.svg`,
    network: 'Tron',
    changenow: { ticker: 'usdt', network: 'trx' },
    ffio: { code: 'USDTTRC' },
  },
  SOL: {
    label: 'SOL',
    image: `${CDN}/sol.svg`,
    network: 'Solana',
    changenow: { ticker: 'sol' },
    ffio: { code: 'SOL' },
  },
  XMR: {
    label: 'XMR',
    image: `${CDN}/xmr.svg`,
    network: 'Monero',
    changenow: { ticker: 'xmr' },
    ffio: { code: 'XMR' },
  },
};

/** All supported canonical tickers, in display order. */
export const SUPPORTED_TICKERS = Object.keys(CURRENCY_MAP);

/** Look up a canonical ticker by ff.io code. Returns undefined if not found. */
export function canonicalFromFfioCode(code: string): string | undefined {
  return SUPPORTED_TICKERS.find((k) => CURRENCY_MAP[k].ffio.code === code);
}

/** Look up a canonical ticker by ChangeNow ticker+network. Returns undefined if not found. */
export function canonicalFromChangeNow(ticker: string, network?: string): string | undefined {
  return SUPPORTED_TICKERS.find((k) => {
    const cn = CURRENCY_MAP[k].changenow;
    return cn.ticker === ticker.toLowerCase() && (cn.network ?? '') === (network?.toLowerCase() ?? '');
  });
}
