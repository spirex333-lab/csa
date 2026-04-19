import * as bitcoin from 'bitcoinjs-lib';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import { getAddress, isAddress } from 'ethers';

function validateBtc(address: string): boolean {
  try {
    bitcoin.address.toOutputScript(address, bitcoin.networks.bitcoin);
    return true;
  } catch {
    return false;
  }
}

function validateEth(address: string): boolean {
  if (!address.startsWith('0x')) return false;
  if (!isAddress(address)) return false;
  // If all lowercase, accept (canonical form)
  if (address === address.toLowerCase()) return true;
  // Any uppercase letters (mixed-case or all-uppercase) → enforce EIP-55 checksum
  try {
    return getAddress(address) === address;
  } catch {
    return false;
  }
}

function validateTrc20(address: string): boolean {
  if (!address.startsWith('T')) return false;
  try {
    const decoded = bs58.decode(address);
    // Tron address: version byte 0x41 + 20-byte hash + 4-byte checksum = 25 bytes
    return decoded.length === 25 && decoded[0] === 0x41;
  } catch {
    return false;
  }
}

function validateSol(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

function validateXmr(address: string): boolean {
  // Standard: 95 chars, integrated: 106 chars — both base58
  if (address.length !== 95 && address.length !== 106) return false;
  try {
    const decoded = bs58.decode(address);
    // Standard address decodes to 69 bytes, integrated to 77 bytes
    return decoded.length === 69 || decoded.length === 77;
  } catch {
    return false;
  }
}

const VALIDATORS: Record<string, (address: string) => boolean> = {
  // Canonical keys (used by CreateOrderDto.toCanonical)
  btc: validateBtc,
  eth: validateEth,
  usdt_erc20: validateEth,
  usdt_trc20: validateTrc20,
  sol: validateSol,
  xmr: validateXmr,
};

export function validateAddress(ticker: string, address: string): boolean {
  const validator = VALIDATORS[ticker.toLowerCase()];
  if (!validator) return false;
  try {
    return validator(address);
  } catch {
    return false;
  }
}
