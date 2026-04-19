import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SupportedAsset } from '../libs/backend/be-commons/src/entities/supported-asset.entity';

const CHANGENOW_API_KEY = process.env.CHANGENOW_API_KEY ?? '';
const API_URL = 'https://api.changenow.io/v2/exchange/currencies?active=true&flow=standard';

async function fetchCurrencies(): Promise<any[]> {
  const res = await fetch(API_URL, {
    headers: { 'x-changenow-api-key': CHANGENOW_API_KEY },
  });
  if (!res.ok) throw new Error(`ChangeNow API error: ${res.status}`);
  return res.json();
}

async function main() {
  const ds = new DataSource({
    type: (process.env.DB_TYPE as any) || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'csa',
    entities: [SupportedAsset],
    synchronize: false,
  });

  await ds.initialize();
  const repo = ds.getRepository(SupportedAsset);

  const currencies = await fetchCurrencies();
  console.log(`Fetched ${currencies.length} currencies from ChangeNow`);

  for (const c of currencies) {
    await repo.upsert(
      {
        ticker: c.ticker,
        name: c.name,
        network: c.network ?? c.ticker,
        logoUrl: c.image ?? null,
        minAmount: c.minAmount ?? null,
        maxAmount: c.maxAmount ?? null,
        isActive: c.isActive !== false,
      },
      { conflictPaths: ['ticker', 'network'] }
    );
  }

  console.log(`Upserted ${currencies.length} supported assets`);
  await ds.destroy();
}

main().catch((e) => { console.error(e); process.exit(1); });
