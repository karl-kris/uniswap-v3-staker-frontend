import { useCallback, useState } from 'react';

import { useWallet } from 'contexts/wallet';
import { useContracts } from 'contexts/contracts';
import { useNotifications } from 'contexts/notifications';
import { useData } from 'contexts/data';
import { useTranslation } from 'react-i18next';

const usePosition = (tokenId: number) => {
  const { tx } = useNotifications();
  const { address } = useWallet();
  const {
    nftManagerPositionsContract,
    stakingRewardsContract,
  } = useContracts();
  const { currentIncentive } = useData();
  const { t } = useTranslation();

  const [isWorking, setIsWorking] = useState<string | null>(null);

  const approve = useCallback(
    async (next: () => void) => {
      if (
        !(
          nftManagerPositionsContract &&
          stakingRewardsContract &&
          currentIncentive
        )
      )
        return;

      try {
        setIsWorking(t('Approving'));
        await tx(t('Approving'), t('Approved'), () =>
          nftManagerPositionsContract.approve(
            stakingRewardsContract.address,
            tokenId
          )
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [
      nftManagerPositionsContract,
      stakingRewardsContract,
      currentIncentive,
      t,
      tx,
      tokenId,
    ]
  );

  const transfer = useCallback(
    async (next: () => void) => {
      if (
        !(
          address &&
          nftManagerPositionsContract &&
          stakingRewardsContract &&
          currentIncentive
        )
      )
        return;

      try {
        setIsWorking(t('Transfering'));
        await tx(
          t('Transfering'),
          t('Transfered'),
          () =>
            nftManagerPositionsContract[
              'safeTransferFrom(address,address,uint256)'
            ](address, stakingRewardsContract.address, tokenId) // https://stackoverflow.com/questions/68289806/no-safetransferfrom-function-in-ethers-js-contract-instance
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [
      address,
      nftManagerPositionsContract,
      stakingRewardsContract,
      currentIncentive,
      t,
      tx,
      tokenId,
    ]
  );

  const stake = useCallback(
    async (next: () => void) => {
      if (!(stakingRewardsContract && currentIncentive)) return;

      try {
        setIsWorking(t('Staking'));
        await tx(t('Staking'), t('Staked'), () =>
          stakingRewardsContract.stakeToken(currentIncentive.key, tokenId)
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [stakingRewardsContract, currentIncentive, t, tx, tokenId]
  );

  const unstake = useCallback(
    async (next: () => void) => {
      if (!(stakingRewardsContract && currentIncentive)) return;

      try {
        setIsWorking(t('Unstaking'));
        await tx(t('Unstaking'), t('Unstaked'), () =>
          stakingRewardsContract.unstakeToken(currentIncentive.key, tokenId)
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [stakingRewardsContract, currentIncentive, t, tx, tokenId]
  );

  const claim = useCallback(
    async (next: () => void) => {
      if (!(stakingRewardsContract && currentIncentive && address)) return;

      try {
        setIsWorking(t('Claiming'));
        const reward = await stakingRewardsContract.rewards(
          currentIncentive.key.rewardToken,
          address
        );
        await tx(t('Claiming'), t('ClaimedEx'), () =>
          stakingRewardsContract.claimReward(
            currentIncentive.key.rewardToken,
            address,
            reward
          )
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [stakingRewardsContract, currentIncentive, address, t, tx]
  );

  const withdraw = useCallback(
    async (next: () => void) => {
      if (!(stakingRewardsContract && address)) return;

      try {
        setIsWorking(t('Withdrawing'));
        await tx(t('Withdrawing'), t('Withdrew'), () =>
          stakingRewardsContract.withdrawToken(tokenId, address, [])
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [stakingRewardsContract, address, t, tx, tokenId]
  );

  return { isWorking, approve, transfer, stake, unstake, claim, withdraw };
};

export default usePosition;
