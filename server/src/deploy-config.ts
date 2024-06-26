import dotenv from 'dotenv';
import {Network} from "@orbs-network/ton-access";

dotenv.config();

if (!process.env.CORS_ENABLED) {
  throw new Error('CORS_ENABLED is not set');
}

if (process.env.CORS_ENABLED !== 'true' && process.env.CORS_ENABLED !== 'false') {
  throw new Error(`CORS_ENABLED is not valid: ${process.env.CORS_ENABLED} is not true or false`);
}

if (process.env.CORS_ENABLED === 'true' && !process.env.CORS_ORIGIN) {
  throw new Error('CORS_ORIGIN is not set');
}

if (!process.env.NETWORK) {
  throw new Error('NETWORK is not set');
}

if (process.env.NETWORK !== 'mainnet' && process.env.NETWORK !== 'testnet') {
  throw new Error(`NETWORK is not valid: ${process.env.NETWORK} is not mainnet or testnet`);
}

if (!process.env.MNEMONIC) {
  throw new Error('MNEMONIC is not set');
}

if (process.env.MNEMONIC.split(' ').length !== 24) {
  throw new Error(`MNEMONIC is not valid: is not 24 words`);
}

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set');
}

export interface DeployConfig {
  CORS_ENABLED: boolean;
  CORS_ORIGIN?: string;
  NETWORK: Network;
  MNEMONIC: string;
  TELEGRAM_BOT_TOKEN: string;
}

export const deployConfig: DeployConfig = {
  CORS_ENABLED: process.env.CORS_ENABLED === 'true',
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  NETWORK: process.env.NETWORK,
  MNEMONIC: process.env.MNEMONIC,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
};
