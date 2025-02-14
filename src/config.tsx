export const BORDER_RADIUS = 30;
export const APP_NAME = 'MAR ERC20 | Staking';

export const LG_BREAKPOINT = 'md';
export const SM_BREAKPOINT = 'sm';

export const IS_DEV = process.env.NODE_ENV === 'development';

export const CACHE_WALLET_KEY = 'wallet';

export const NETWORK_MAINNET = 'mainnet';
export const NETWORK_GOERLI = 'goerli';
export const AVAILABLE_NETWORKS = [NETWORK_MAINNET, NETWORK_GOERLI];

export const TOKEN_0_ADDRESS: Record<string, string> = {
  [NETWORK_MAINNET]: '0x4343d80ef5808490a079aa0907ffdc9373c7a4dd',
  [NETWORK_GOERLI]: '0x4343d80ef5808490a079aa0907ffdc9373c7a4dd',
};

export const TOKEN_1_ADDRESS: Record<string, string> = {
  [NETWORK_MAINNET]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [NETWORK_GOERLI]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
};

export const NFT_POSITIONS_MANAGER_ADDRESS: Record<string, string> = {
  [NETWORK_MAINNET]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  [NETWORK_GOERLI]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
};

export const STAKING_REWARDS_ADDRESS: Record<string, string> = {
  [NETWORK_MAINNET]: '0xe34139463bA50bD61336E0c446Bd8C0867c6fE65',
  [NETWORK_GOERLI]: '0xe34139463bA50bD61336E0c446Bd8C0867c6fE65',
};

export const SUBGRAPHS: Record<string, string> = {
  [NETWORK_MAINNET]:
    'https://api.thegraph.com/subgraphs/name/mchainnetwork/mar-staking-mainnet',
  [NETWORK_GOERLI]:
    'https://api.thegraph.com/subgraphs/name/mchainnetwork/mar-staking-goerli',
};
