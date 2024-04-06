export const BORDER_RADIUS = 30;
export const APP_NAME = 'MARK | Staking';

export const LG_BREAKPOINT = 'md';
export const SM_BREAKPOINT = 'sm';

export const IS_DEV = 1;

export const CACHE_WALLET_KEY = 'wallet';

export const NETWORK_MAINNET = 'mainnet';
export const NETWORK_SEPOLIA = 'sepolia';
export const AVAILABLE_NETWORKS = [NETWORK_SEPOLIA];

export const TOKEN_0_ADDRESS: Record<string, string> = {
  [NETWORK_MAINNET]: '',
  [NETWORK_SEPOLIA]: '0x8aE7de3a5cFe804E4b4adD9f2881CB90042CBcE0',
};

// WETH
export const TOKEN_1_ADDRESS: Record<string, string> = {
  [NETWORK_MAINNET]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [NETWORK_SEPOLIA]: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
};

export const NFT_POSITIONS_MANAGER_ADDRESS: Record<string, string> = {
  [NETWORK_MAINNET]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  [NETWORK_SEPOLIA]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
};

export const STAKING_REWARDS_ADDRESS: Record<string, string> = {
  [NETWORK_MAINNET]: '0xe34139463bA50bD61336E0c446Bd8C0867c6fE65',
  [NETWORK_SEPOLIA]: '0xe34139463bA50bD61336E0c446Bd8C0867c6fE65',
};

export const SUBGRAPHS: Record<string, string> = {
  [NETWORK_MAINNET]:
    'https://api.thegraph.com/subgraphs/name/mchainnetwork/mark-staking-arbitrum',
  [NETWORK_SEPOLIA]:
    'https://api.thegraph.com/subgraphs/name/mchainnetwork/mark-staking-sepolia',
};
