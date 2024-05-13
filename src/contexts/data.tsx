import {
  FC,
  useState,
  useContext,
  useMemo,
  useEffect,
  useCallback,
  createContext,
  ReactNode,
} from 'react';
import _flatten from 'lodash/flatten';
import _orderBy from 'lodash/orderBy';

import { useWallet } from 'contexts/wallet';
import { useContracts } from 'contexts/contracts';
import useTokenInfo from 'hooks/useTokenInfo';
import { Incentive, LiquidityPosition } from 'utils/types';
import { toBigNumber } from 'utils/big-number';
import * as request from 'utils/request';
import {
  SUBGRAPHS,
  TOKEN_0_ADDRESS,
  TOKEN_1_ADDRESS,
  AVAILABLE_NETWORKS,
} from 'config';

const DataContext = createContext<{
  positions: LiquidityPosition[];
  incentives: Incentive[];
  currentIncentiveId: string | null;
  currentIncentive: Incentive | null;
  setCurrentIncentiveId: (id: string) => void;
  currentIncentiveRewardTokenSymbol: string | null;
  currentIncentiveRewardTokenDecimals: number | null;
} | null>(null);

export const DataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const {
    stakingRewardsContract,
    nftManagerPositionsContract,
  } = useContracts();
  const { network, address } = useWallet();
  const [positions, setPositions] = useState<LiquidityPosition[]>([]);
  const [incentives, setIncentiveIds] = useState<Incentive[]>([]);
  const [currentIncentiveId, setCurrentIncentiveId] = useState<string | null>(
    null
  );

  const currentIncentive = useMemo(
    () =>
      !currentIncentiveId
        ? null
        : incentives.find((incentive) => incentive.id === currentIncentiveId) ??
          null,
    [currentIncentiveId, incentives]
  );

  const {
    decimals: currentIncentiveRewardTokenDecimals,
    symbol: currentIncentiveRewardTokenSymbol,
  } = useTokenInfo(currentIncentive?.key.rewardToken ?? null);

  // load incentives
  useEffect(() => {
    if (
      !network ||
      !AVAILABLE_NETWORKS.includes(network) ||
      TOKEN_0_ADDRESS[network] === ''
    )
      return;

    const load = async () => {
      const subgraph = request.subgraph(SUBGRAPHS[network])!;
      const rewardTokenAddress = TOKEN_0_ADDRESS[network];
      const results = await subgraph(
        `query($rewardTokenAddress: String!) {
          incentives(where: { rewardToken: $rewardTokenAddress }, orderBy: endTime, orderDirection: desc) {
            id
            rewardToken
            pool
            startTime
            endTime
            refundee
            reward
            ended
          }
        }`,
        { rewardTokenAddress }
      );
      if (!results || !results.incentives.length) {
        return;
      }
      setIncentiveIds(
        results.incentives.map(
          ({
            id,
            rewardToken,
            pool,
            startTime,
            endTime,
            refundee,
            reward,
            ended,
          }: {
            id: string;
            rewardToken: string;
            pool: string;
            startTime: number;
            endTime: number;
            refundee: string;
            reward: number;
            ended: boolean;
          }) =>
            ({
              id,
              reward: toBigNumber(reward),
              ended,
              key: {
                rewardToken,
                pool,
                startTime: Number(startTime),
                endTime: Number(endTime),
                refundee,
              },
            } as Incentive)
        )
      );
      setCurrentIncentiveId(results.incentives[0]?.id ?? null);
    };

    load();
  }, [network]);

  // load owned and transfered positions
  const refreshPositions = useCallback(async () => {
    if (
      !(
        nftManagerPositionsContract &&
        stakingRewardsContract &&
        address &&
        network &&
        AVAILABLE_NETWORKS.includes(network) &&
        TOKEN_0_ADDRESS[network] !== '' &&
        TOKEN_1_ADDRESS[network] !== '' &&
        currentIncentive &&
        currentIncentive.key
      )
    )
      return;

    const subgraph = request.subgraph(SUBGRAPHS[network]);
    if (!subgraph) return;

    const query = `
      query {
        positions(where: { owner: "${address}" }) {
          id
          tokenId
          owner
          staked
          liquidity
          approved
        }
      }
    `;

    try {
      const { positions } = await subgraph(query, { owner: address });
      const detailedPositions = [];

      for (const pos of positions) {
        try {
          const {
            liquidity,
            token0,
            token1,
          } = await nftManagerPositionsContract.positions(pos.tokenId);
          if (liquidity.isZero()) return null;

          if (
            (token0 === TOKEN_0_ADDRESS[network] &&
              token1 === TOKEN_1_ADDRESS[network]) ||
            (token0 === TOKEN_1_ADDRESS[network] &&
              token1 === TOKEN_0_ADDRESS[network])
          ) {
            let reward = toBigNumber(0);
            let staked = pos.staked;

            if (staked) {
              try {
                const [
                  rewardAmount,
                ] = await stakingRewardsContract.getRewardInfo(
                  currentIncentive.key,
                  pos.tokenId
                );
                reward = toBigNumber(rewardAmount.toString());
              } catch (err) {
                console.error(
                  `Failed to fetch reward info for token ID ${pos.tokenId}:`,
                  err
                );
              }
            }

            detailedPositions.push({
              tokenId: Number(pos.tokenId),
              owner: pos.owner,
              reward,
              staked,
              token0,
              token1,
            });
          }
        } catch (err) {
          console.error(
            `Failed to fetch position details for token ID ${pos.tokenId}:`,
            err
          );
        }
      }

      setPositions(_orderBy(detailedPositions, ['tokenId'], ['desc']));
    } catch (error) {
      console.error('Error fetching positions from subgraph:', error);
    }
  }, [
    address,
    network,
    nftManagerPositionsContract,
    stakingRewardsContract,
    currentIncentive,
  ]);

  useEffect(() => {
    refreshPositions();

    const intervalId = setInterval(() => {
      refreshPositions();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [
    address,
    nftManagerPositionsContract,
    stakingRewardsContract,
    currentIncentive,
    network,
    refreshPositions,
  ]);

  /*
  useEffect(() => {
    if (
      !(
        nftManagerPositionsContract &&
        stakingRewardsContract &&
        address &&
        currentIncentiveId &&
        currentIncentive &&
        network
      )
    )
      return;

    let isMounted = true;
    const unsubs = [
      () => {
        isMounted = false;
      },
    ];

    const loadPositions = async (owner: string) => {
      const noOfPositions = await nftManagerPositionsContract.balanceOf(owner);
      const positions = await Promise.all(
        new Array(noOfPositions.toNumber())
          .fill(0)
          .map((_, index) => loadPosition(owner, index))
      );
      const ownerPositions: LiquidityPosition[] = [];
      positions.forEach((position) => {
        console.log(position);
        if (position) {
          if (
            (position.token0 === TOKEN_0_ADDRESS[network] &&
              position.token1 === TOKEN_1_ADDRESS[network]) ||
            (position.token0 === TOKEN_1_ADDRESS[network] &&
              position.token1 === TOKEN_0_ADDRESS[network])
          ) {
            ownerPositions.push(position);
          }
        }
      });
      return ownerPositions;
    };

    const loadPosition = async (
      owner: string,
      index: number
    ): Promise<LiquidityPosition | null> => {
      const tokenId = await nftManagerPositionsContract.tokenOfOwnerByIndex(
        owner,
        index
      );
      const {
        liquidity,
        token0,
        token1,
      } = await nftManagerPositionsContract.positions(tokenId);
      if (liquidity.isZero()) return null;
      const position = await stakingRewardsContract.deposits(tokenId);
      if (owner !== address && position.owner !== address) return null;
      let staked = false;
      let reward = toBigNumber(0);
      try {
        const [rewardNumber] = await stakingRewardsContract.getRewardInfo(
          currentIncentive.key,
          tokenId
        );
        reward = toBigNumber(rewardNumber.toString());
        staked = true;
      } catch {}
      return {
        tokenId: Number(tokenId.toString()),
        owner,
        reward,
        staked,
        token0,
        token1,
      };
    };

    const load = async () => {
      const owners: string[] = [address, stakingRewardsContract.address];
      const positions = await Promise.all(owners.map(loadPositions));
      console.log(positions);
      if (isMounted) {
        setPositions(_orderBy(_flatten(positions), 'tokenId'));
      }
    };

    load();

    return () => {
      unsubs.map((u) => u());
    };
  }, [
    nftManagerPositionsContract,
    stakingRewardsContract,
    address,
    currentIncentiveId,
    currentIncentive,
    network,
  ]);
  */

  useEffect(() => {
    if (!(stakingRewardsContract && currentIncentiveId)) return;

    let isMounted = true;
    const unsubs = [
      () => {
        isMounted = false;
      },
    ];

    const updateStaked = (tokenId: number, incentiveId: string) => {
      if (incentiveId !== currentIncentiveId) return;
      if (isMounted) {
        setPositions((positions) =>
          positions.map((position) => {
            if (position.tokenId !== Number(tokenId.toString()))
              return position;
            position.staked = true;
            return position;
          })
        );
      }
    };

    const updateUnstaked = (tokenId: number, incentiveId: string) => {
      if (incentiveId !== currentIncentiveId) return;
      if (isMounted) {
        setPositions((positions) =>
          positions.map((position) => {
            if (position.tokenId !== Number(tokenId.toString()))
              return position;
            position.staked = false;
            return position;
          })
        );
      }
    };

    const subscribe = () => {
      const stakedEvent = stakingRewardsContract.filters.TokenStaked();
      const unstakedEvent = stakingRewardsContract.filters.TokenUnstaked();

      stakingRewardsContract.on(stakedEvent, updateStaked);
      stakingRewardsContract.on(unstakedEvent, updateUnstaked);

      unsubs.push(() => {
        stakingRewardsContract.off(stakedEvent, updateStaked);
      });
      unsubs.push(() => {
        stakingRewardsContract.off(unstakedEvent, updateUnstaked);
      });
    };

    subscribe();

    return () => {
      unsubs.map((u) => u());
    };
  }, [stakingRewardsContract, positions, currentIncentiveId]);

  return (
    <DataContext.Provider
      value={{
        positions,
        incentives,
        currentIncentiveId,
        currentIncentive,
        setCurrentIncentiveId,
        currentIncentiveRewardTokenSymbol,
        currentIncentiveRewardTokenDecimals,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('Missing Data context');
  }
  const {
    positions,
    incentives,
    currentIncentiveId,
    currentIncentive,
    setCurrentIncentiveId,
    currentIncentiveRewardTokenSymbol,
    currentIncentiveRewardTokenDecimals,
  } = context;

  return {
    positions,
    incentives,
    currentIncentiveId,
    currentIncentive,
    setCurrentIncentiveId,
    currentIncentiveRewardTokenSymbol,
    currentIncentiveRewardTokenDecimals,
  };
}
