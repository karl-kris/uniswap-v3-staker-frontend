import { FC, useCallback, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import * as ethers from 'ethers';
import { useMediaQuery, useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import moment from 'moment';

import { useWallet } from 'contexts/wallet';
import { useContracts } from 'contexts/contracts';
import { useNotifications } from 'contexts/notifications';
import { useData } from 'contexts/data';
import { LiquidityPosition } from 'utils/types';
import { formatUnits } from 'utils/big-number';

export const useStyles = makeStyles((theme) => ({
  maxButton: {
    height: 35,
  },
  depositButtonCell: {
    width: 110,
    padding: 5,
  },
  depositButton: {
    width: 100,
    marginRight: 2,
  },
  positionCard: {
    marginTop: 20,
    backgroundColor: theme.palette.background.default,
  },
}));

const Stake: FC<{ history: any }> = ({ history }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const { startConnecting: startConnectingWallet, address } = useWallet();
  const {
    token0Address,
    //token1Address,
    token0Symbol,
    token1Symbol,
  } = useContracts();
  const {
    positions,
    currentIncentiveId,
    incentives,
    setCurrentIncentiveId,
  } = useData();

  return (
    <>
      <Box p={5}>
        {!address ? (
          <>
            <Box>
              <img
                src='rewards-coins.png'
                alt='MARK rewards'
                className='rewards-coins'
              />
              <Typography variant='h4' align='center'>
                Earn MARK rewards by staking your liquidity positions on
                Arbitrum network!
              </Typography>
            </Box>

            <Box mt={4} className='flex justify-center'>
              <Button
                color='secondary'
                variant='contained'
                onClick={startConnectingWallet}
              >
                Connect your wallet
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box>
              <Typography variant='h5'>
                You have {positions.length} {token0Symbol}-{token1Symbol}{' '}
                liquidity positions.
              </Typography>
            </Box>

            <Box>
              <Typography>
                Get {!positions.length ? 'some' : 'more'} rewards by providing
                liquidity to the{' '}
                <a
                  href={`https://app.uniswap.org/add/${[
                    'eth',
                    token0Address,
                  ].join('/')}/10000`}
                  target='_blank'
                  className='text-decoration-none'
                  rel='noopener noreferrer'
                >
                  {token0Symbol}-{token1Symbol} Pool
                </a>
                .
              </Typography>
            </Box>

            <Box
              mt={4}
              display='flex'
              flexDirection={{ xs: 'column', md: 'row' }}
            >
              <Box mb={3}>
                <FormControl>
                  {!currentIncentiveId ? null : (
                    <>
                      <InputLabel id='incentive-label' shrink>
                        Incentive
                      </InputLabel>
                      <Select
                        labelId='incentive-label'
                        id='incentive'
                        value={currentIncentiveId}
                        displayEmpty
                        onChange={(e) => {
                          setCurrentIncentiveId(e.target.value as string);
                        }}
                      >
                        {incentives.map((incentive) => (
                          <MenuItem value={incentive.id} key={incentive.id}>
                            {formatDate(incentive.key.startTime)} -{' '}
                            {formatDate(incentive.key.endTime)}{' '}
                            {incentive.ended ? 'ENDED' : ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  )}
                </FormControl>
              </Box>
              <ClaimAvailableReward />
            </Box>

            {!positions.length ? null : isMobile ? (
              positions.map((position) => (
                <LiquidityPositionTableRow
                  key={position.tokenId}
                  {...{ position, history, isMobile }}
                />
              ))
            ) : (
              <Box mt={2}>
                <Table aria-label='Loans' size={'small'}>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Rewards</TableCell>
                      <TableCell
                        align='right'
                        className={classes.depositButtonCell}
                      ></TableCell>
                      <TableCell
                        align='right'
                        className={classes.depositButtonCell}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {positions.map((position) => (
                      <LiquidityPositionTableRow
                        key={position.tokenId}
                        {...{ position, history, isMobile }}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
};

const LiquidityPositionTableRow: FC<{
  position: LiquidityPosition;
  history: any;
  isMobile?: boolean;
}> = ({ position, history, isMobile }) => {
  const classes = useStyles();
  const { address } = useWallet();
  const { token0Decimals } = useContracts();

  const stake = useCallback(async () => {
    history.push(`/stake/${position.tokenId}`);
  }, [position.tokenId, history]);

  const unstake = useCallback(async () => {
    history.push(`/unstake/${position.tokenId}`);
  }, [position.tokenId, history]);

  const withdraw = useCallback(async () => {
    history.push(`/withdraw/${position.tokenId}`);
  }, [position.tokenId, history]);

  return isMobile ? (
    <Card className={classes.positionCard}>
      <CardContent>
        <Box display='flex' flexDirection='column'>
          <Box>
            <Box>ID: {position.tokenId.toString()}</Box>
            <Box>
              {!position.reward.isZero() ? (
                <Box>
                  <Box mr={1}>
                    Rewards: {formatUnits(position.reward, token0Decimals)}
                    <Tooltip
                      title='Unstake position in order to claim accrued rewards.'
                      arrow
                      placement='top'
                    >
                      <Box
                        display='flex'
                        alignItems='center'
                        className='cursor'
                      >
                        <InfoIcon fontSize='small' />
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>
              ) : (
                '-'
              )}
            </Box>
          </Box>

          <Box display='flex' justifyContent='space-between' mt={2}>
            <Button
              color='secondary'
              variant='contained'
              onClick={position.staked ? unstake : stake}
              className={classes.depositButton}
            >
              {position.staked ? 'Unstake' : 'Stake'}
            </Button>
            <Button
              color='secondary'
              variant='contained'
              onClick={withdraw}
              className={classes.depositButton}
              disabled={position.owner === address}
            >
              Withdraw
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  ) : (
    <TableRow>
      <TableCell component='th' scope='row'>
        {position.tokenId.toString()}
      </TableCell>
      <TableCell>
        {!position.reward.isZero() ? (
          <Box className='flex items-center'>
            <Box mr={1}>{formatUnits(position.reward, token0Decimals)}</Box>
            <Tooltip
              title='Unstake position in order to claim accrued rewards.'
              arrow
              placement='top'
            >
              <Box className='flex items-center cursor'>
                <InfoIcon fontSize='small' />
              </Box>
            </Tooltip>
          </Box>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell align='right' className={classes.depositButtonCell}>
        <Button
          color='secondary'
          variant='contained'
          onClick={position.staked ? unstake : stake}
          className={classes.depositButton}
        >
          {position.staked ? 'Unstake' : 'Stake'}
        </Button>
      </TableCell>
      <TableCell align='right' className={classes.depositButtonCell}>
        <Button
          color='secondary'
          variant='contained'
          onClick={withdraw}
          className={classes.depositButton}
          disabled={position.owner === address}
        >
          Withdraw
        </Button>
      </TableCell>
    </TableRow>
  );
};

const ClaimAvailableReward: FC = () => {
  const classes = useStyles();
  const { stakingRewardsContract } = useContracts();
  const {
    currentIncentiveRewardTokenSymbol,
    currentIncentiveRewardTokenDecimals,
    currentIncentive,
  } = useData();
  const { address } = useWallet();
  const { tx } = useNotifications();

  const [reward, setReward] = useState(ethers.BigNumber.from(0));
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (!(stakingRewardsContract && currentIncentive && address)) return;

    let isMounted = true;
    const unsubs = [
      () => {
        isMounted = false;
      },
    ];

    const load = async () => {
      const reward = await stakingRewardsContract.rewards(
        currentIncentive.key.rewardToken,
        address
      );
      if (isMounted) setReward(reward);
    };

    const subscribe = () => {
      const tokenUnstakedEvent = stakingRewardsContract.filters.TokenUnstaked();
      stakingRewardsContract.on(tokenUnstakedEvent, load);
      unsubs.push(() => {
        stakingRewardsContract.off(tokenUnstakedEvent, load);
      });

      const rewardClaimedEvent = stakingRewardsContract.filters.RewardClaimed();
      stakingRewardsContract.on(rewardClaimedEvent, load);
      unsubs.push(() => {
        stakingRewardsContract.off(rewardClaimedEvent, load);
      });
    };

    load();
    subscribe();

    return () => {
      unsubs.map((u) => u());
    };
  }, [stakingRewardsContract, currentIncentive, address]);

  const claim = async () => {
    if (!(stakingRewardsContract && currentIncentive)) return;

    try {
      setIsClaiming(true);
      const reward = await stakingRewardsContract.rewards(
        currentIncentive.key.rewardToken,
        address
      );
      await tx('Claiming...', 'Claimed!', () =>
        stakingRewardsContract.claimReward(
          currentIncentive.key.rewardToken,
          address,
          reward
        )
      );
    } catch (e) {
      console.warn(e);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <Box marginLeft='auto'>
      <Box className='flex items-center' mb={1}>
        <Box mr={1}>Total Incentive:</Box>{' '}
        <Box>
          {formatUnits(
            currentIncentive?.reward,
            currentIncentiveRewardTokenDecimals,
            0
          )}{' '}
          {currentIncentiveRewardTokenSymbol}{' '}
        </Box>
      </Box>
      <Box className='flex items-center'>
        <Box mr={1}>REWARDS:</Box>{' '}
        <Box mr={2}>
          {formatUnits(reward, currentIncentiveRewardTokenDecimals)}{' '}
          {currentIncentiveRewardTokenSymbol}
        </Box>
        <Button
          color='secondary'
          variant='contained'
          onClick={claim}
          className={classes.depositButton}
          disabled={isClaiming || reward.isZero()}
        >
          {isClaiming ? 'Claiming...' : 'Claim'}
        </Button>
      </Box>
    </Box>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function formatTimestamp(unix: number) {
  return moment.unix(unix).local().format('YYYY-MM-DD HHmm[h]');
}

function formatDate(unix: number) {
  return moment.unix(unix).local().format('MM/DD/YYYY');
}

export default withRouter(Stake);
