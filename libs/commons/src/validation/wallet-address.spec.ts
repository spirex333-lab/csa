import { validateAddress } from './wallet-address';

describe('validateAddress', () => {
  describe('BTC', () => {
    it('accepts P2PKH address', () => {
      expect(validateAddress('BTC', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')).toBe(true);
    });
    it('accepts bech32 P2WPKH address', () => {
      expect(validateAddress('BTC', 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')).toBe(true);
    });
    it('accepts P2SH address', () => {
      expect(validateAddress('BTC', '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy')).toBe(true);
    });
    it('rejects garbage', () => {
      expect(validateAddress('BTC', 'notanaddress')).toBe(false);
    });
    it('rejects ETH address', () => {
      expect(validateAddress('BTC', '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe')).toBe(false);
    });
  });

  describe('ETH', () => {
    it('accepts lowercase hex address', () => {
      expect(validateAddress('ETH', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(true);
    });
    it('accepts EIP-55 checksummed address', () => {
      expect(validateAddress('ETH', '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe')).toBe(true);
    });
    it('rejects wrong checksum', () => {
      expect(validateAddress('ETH', '0xDE0B295669A9FD93D5F28D9EC85E40F4CB697BAE')).toBe(false);
    });
    it('rejects too-short hex', () => {
      expect(validateAddress('ETH', '0xde0b295')).toBe(false);
    });
    it('rejects missing 0x prefix', () => {
      expect(validateAddress('ETH', 'de0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(false);
    });
  });

  describe('USDT_ERC20', () => {
    it('accepts valid ETH-format address', () => {
      expect(validateAddress('USDT_ERC20', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(true);
    });
    it('rejects invalid address', () => {
      expect(validateAddress('USDT_ERC20', 'notanaddress')).toBe(false);
    });
  });

  describe('USDT_TRC20', () => {
    it('accepts valid Tron address', () => {
      expect(validateAddress('USDT_TRC20', 'TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7')).toBe(true);
    });
    it('rejects ETH address', () => {
      expect(validateAddress('USDT_TRC20', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(false);
    });
    it('rejects garbage', () => {
      expect(validateAddress('USDT_TRC20', 'notanaddress')).toBe(false);
    });
  });

  describe('SOL', () => {
    it('accepts valid Solana public key', () => {
      expect(validateAddress('SOL', '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM')).toBe(true);
    });
    it('rejects garbage', () => {
      expect(validateAddress('SOL', 'notanaddress')).toBe(false);
    });
    it('rejects ETH address', () => {
      expect(validateAddress('SOL', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(false);
    });
  });

  describe('XMR', () => {
    it('accepts standard Monero address (95 chars)', () => {
      expect(validateAddress('XMR', '44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A')).toBe(true);
    });
    it('rejects garbage', () => {
      expect(validateAddress('XMR', 'notanaddress')).toBe(false);
    });
    it('rejects ETH address', () => {
      expect(validateAddress('XMR', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(false);
    });
  });

  describe('unknown ticker', () => {
    it('returns false for unrecognised coin', () => {
      expect(validateAddress('UNKNOWN_COIN_XYZ', '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae')).toBe(false);
    });
  });
});
