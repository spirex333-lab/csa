import { validateAddress } from './wallet-address';

describe('validateAddress', () => {
  // BTC
  describe('btc', () => {
    it('accepts P2PKH address', () => {
      expect(validateAddress('btc', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')).toBe(true);
    });
    it('accepts bech32 P2WPKH address', () => {
      expect(validateAddress('btc', 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')).toBe(true);
    });
    it('accepts P2SH address', () => {
      expect(validateAddress('btc', '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy')).toBe(true);
    });
    it('rejects garbage', () => {
      expect(validateAddress('btc', 'notanaddress')).toBe(false);
    });
    it('rejects ETH address', () => {
      expect(validateAddress('btc', '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe')).toBe(false);
    });
  });

  // ETH
  describe('eth', () => {
    it('accepts lowercase hex address', () => {
      expect(validateAddress('eth', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(true);
    });
    it('accepts EIP-55 checksummed address', () => {
      expect(validateAddress('eth', '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe')).toBe(true);
    });
    it('rejects wrong checksum', () => {
      expect(validateAddress('eth', '0xDE0B295669A9FD93D5F28D9EC85E40F4CB697BAE')).toBe(false);
    });
    it('rejects too-short hex', () => {
      expect(validateAddress('eth', '0xde0b295')).toBe(false);
    });
    it('rejects missing 0x prefix', () => {
      expect(validateAddress('eth', 'de0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(false);
    });
  });

  // USDT ERC20 — same rules as ETH
  describe('usdt', () => {
    it('accepts valid ETH-format address', () => {
      expect(validateAddress('usdt', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(true);
    });
    it('rejects invalid address', () => {
      expect(validateAddress('usdt', 'notanaddress')).toBe(false);
    });
  });

  // USDT TRC20
  describe('usdttrc20', () => {
    it('accepts valid Tron address', () => {
      expect(validateAddress('usdttrc20', 'TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7')).toBe(true);
    });
    it('rejects ETH address', () => {
      expect(validateAddress('usdttrc20', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(false);
    });
    it('rejects garbage', () => {
      expect(validateAddress('usdttrc20', 'notanaddress')).toBe(false);
    });
  });

  // SOL
  describe('sol', () => {
    it('accepts valid Solana public key', () => {
      expect(validateAddress('sol', '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM')).toBe(true);
    });
    it('rejects garbage', () => {
      expect(validateAddress('sol', 'notanaddress')).toBe(false);
    });
    it('rejects ETH address', () => {
      expect(validateAddress('sol', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(false);
    });
  });

  // XMR
  describe('xmr', () => {
    it('accepts standard Monero address (95 chars)', () => {
      expect(validateAddress('xmr', '44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A')).toBe(true);
    });
    it('rejects garbage', () => {
      expect(validateAddress('xmr', 'notanaddress')).toBe(false);
    });
    it('rejects ETH address', () => {
      expect(validateAddress('xmr', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(false);
    });
  });

  // Unknown ticker
  describe('unknown ticker', () => {
    it('returns false for unrecognised coin', () => {
      expect(validateAddress('UNKNOWN_COIN_XYZ', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(false);
    });
  });
});
