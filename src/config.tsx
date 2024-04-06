export const BORDER_RADIUS = 30;
export const APP_NAME = 'MARK Staking';

export const LG_BREAKPOINT = 'md';
export const SM_BREAKPOINT = 'sm';

export const IS_DEV = 1;

export const CACHE_WALLET_KEY = 'wallet';

export const NETWORK_MAINNET = 'mainnet';
export const NETWORK_MUMBAI = 'mumbai';
export const NETWORK_ARBITRUM = 'arbitrum';
export const AVAILABLE_NETWORKS = [NETWORK_MUMBAI];

export const EXPLORER_URLS: Record<string, string> = {
  [NETWORK_MAINNET]: 'https://etherscan.io',
  [NETWORK_MUMBAI]: 'https://mumbai.polygonscan.com',
  [NETWORK_ARBITRUM]: 'https://arbiscan.io',
};

export const CHAIN_IDS: Record<string, number> = {
  [NETWORK_MAINNET]: 1,
  [NETWORK_MUMBAI]: 80001,
  [NETWORK_ARBITRUM]: 42161,
};

export const TOKEN_0_ADDRESS: Record<string, string> = {
  [NETWORK_MAINNET]: '',
  [NETWORK_MUMBAI]: '0x8aE7de3a5cFe804E4b4adD9f2881CB90042CBcE0',
  [NETWORK_ARBITRUM]: '',
};

// WETH
export const TOKEN_1_ADDRESS: Record<string, string> = {
  [NETWORK_MAINNET]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [NETWORK_MUMBAI]: '0x005E69B83Ea045836Bca630a2b46D64023f3cb70',
  [NETWORK_ARBITRUM]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
};

export const NFT_POSITIONS_MANAGER_ADDRESS: Record<string, string> = {
  [NETWORK_MAINNET]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  [NETWORK_MUMBAI]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  [NETWORK_ARBITRUM]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
};

export const STAKING_REWARDS_ADDRESS: Record<string, string> = {
  [NETWORK_MAINNET]: '0xe34139463bA50bD61336E0c446Bd8C0867c6fE65',
  [NETWORK_MUMBAI]: '0xe34139463bA50bD61336E0c446Bd8C0867c6fE65',
  [NETWORK_ARBITRUM]: '0xe34139463bA50bD61336E0c446Bd8C0867c6fE65',
};

export const SUBGRAPHS: Record<string, string> = {
  [NETWORK_MAINNET]:
    'https://api.thegraph.com/subgraphs/name/mchainnetwork/mark-staking-arbitrum',
  [NETWORK_MUMBAI]:
    'https://api.thegraph.com/subgraphs/name/mchainnetwork/mark-staking-mumbai',
  [NETWORK_ARBITRUM]:
    'https://api.thegraph.com/subgraphs/name/mchainnetwork/mark-staking-arbitrum',
};
