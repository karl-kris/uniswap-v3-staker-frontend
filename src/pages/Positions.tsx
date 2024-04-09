import { FC, useCallback, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import * as ethers from 'ethers';
import { useMediaQuery, useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import IconButton from '@material-ui/core/IconButton';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import moment from 'moment';

import { useWallet } from 'contexts/wallet';
import { useContracts } from 'contexts/contracts';
import { useNotifications } from 'contexts/notifications';
import { useData } from 'contexts/data';
import { LiquidityPosition } from 'utils/types';
import { formatUnits } from 'utils/big-number';
import { useTranslation } from 'react-i18next';
import { useIncrementingNumber } from 'hooks/useIncrementingNumber';

const useLoadConfettiScript = (onLoad: () => void) => {
  useEffect(() => {
    if (document.getElementById('confetti-script')) {
      onLoad();
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js';
    script.id = 'confetti-script';
    script.onload = () => onLoad();

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [onLoad]);
};

export const useStyles = makeStyles((theme) => ({
  maxButton: {
    height: 35,
  },
  claimButton: {
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
    backgroundColor: '#0099bf5e',
  },
  link: {
    color: 'cyan!important',
    textDecoration: 'none',
    cursor: 'pointer',
    '&:visited': {
      color: 'cyan',
    },
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  helpButton: {
    marginTop: -30,
    marginRight: -30,
    float: 'right',
  },
}));

const Stake: FC<{ history: any }> = ({ history }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const { startConnecting: startConnectingWallet, address } = useWallet();
  const {
    token0Address,
    token1Address,
    token0Symbol,
    token1Symbol,
  } = useContracts();
  const {
    positions,
    currentIncentiveId,
    incentives,
    setCurrentIncentiveId,
  } = useData();

  const [totalRewards, setTotalRewards] = useState(0);
  const updateTotalRewards = useCallback(() => {
    const total = positions.reduce(
      (acc, position) => acc + Number(position.reward),
      0
    );
    setTotalRewards(total);
  }, [positions]);

  useLoadConfettiScript(() => {});

  useEffect(() => {
    updateTotalRewards();
  }, [positions, updateTotalRewards]);

  useEffect(() => {
    if (totalRewards > 0 && window.confetti) {
      window.confetti({
        angle: 90,
        spread: 70,
        particleCount: 100,
        origin: { y: 0.45, x: 0.4 },
      });
    }
  }, [totalRewards]);

  const handleHelpClick = () => {
    let url = 'https://dev.docs.mchain.network';
    const lang = i18n.language;

    if (lang.startsWith('es')) {
      url += '/es';
    } else if (lang.startsWith('pt')) {
      url += '/pt-BR';
    }

    url += '/docs/learn/mark-arbitrum/staking/staking-mark-arbitrum';
    window.open(url, '_blank');
  };

  return (
    <>
      <Box p={5} className='relative'>
        <IconButton
          onClick={handleHelpClick}
          aria-label='help'
          className={classes.helpButton}
        >
          <HelpOutlineIcon />
        </IconButton>
        {!address ? (
          <>
            <Box>
              <img
                src='rewards-coins.png'
                alt='MARK rewards'
                className='rewards-coins'
              />
              <Typography variant='h4' align='center'>
                {t('WelcomeMessage')}
              </Typography>
            </Box>

            <Box mt={4} className='flex justify-center'>
              <Button
                color='secondary'
                variant='contained'
                onClick={startConnectingWallet}
              >
                {t('ConnectYourWallet')}
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box>
              <Typography variant='h5'>
                {t('LiquidityPositions', {
                  count: positions.length,
                  token0Symbol,
                  token1Symbol,
                })}
              </Typography>
            </Box>

            <Box>
              <Typography>
                {t('getRewards', {
                  rewardWord: !positions.length
                    ? t('rewardPlaceholder.some')
                    : t('rewardPlaceholder.more'),
                })}
                <a
                  href={`https://app.uniswap.org/add/${[
                    token1Address,
                    token0Address,
                  ].join('/')}/10000`}
                  target='_blank'
                  className={classes.link}
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
              justifyContent='space-between'
              flexDirection={{ xs: 'column', md: 'row' }}
            >
              <Box mb={3}>
                <FormControl>
                  {!currentIncentiveId ? null : (
                    <>
                      <InputLabel id='incentive-label' shrink>
                        {t('Incentive')}
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
                            <Box marginRight={2}>
                              <Typography variant='body1' component='div'>
                                {`${formatUnits(
                                  incentive?.reward,
                                  18,
                                  0
                                )} ${token0Symbol}`}
                              </Typography>
                              <Typography variant='body2' color='textSecondary'>
                                {formatDate(incentive.key.startTime)} -{' '}
                                {formatDate(incentive.key.endTime)}
                                {incentive.ended ? ` ${t('Ended')}` : ''}
                              </Typography>
                            </Box>
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
                      <TableCell>NFT Id</TableCell>
                      <TableCell>{t('Rewards')}</TableCell>
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
  const { token0Decimals, token0Symbol } = useContracts();
  const { t } = useTranslation();

  const targetNumber = parseFloat(formatUnits(position.reward, token0Decimals));

  const { currentNumber, isAnimating } = useIncrementingNumber(targetNumber);

  const stake = useCallback(async () => {
    history.push(`/stake/${position.tokenId}`);
  }, [position.tokenId, history]);

  const unstake = useCallback(async () => {
    history.push(`/unstake/${position.tokenId}`);
  }, [position.tokenId, history]);

  const withdraw = useCallback(async () => {
    history.push(`/withdraw/${position.tokenId}`);
  }, [position.tokenId, history]);

  const animatingStyle = {
    color: isAnimating ? 'yellow' : 'white',
    transition: 'color 0.5s ease',
  };

  return isMobile ? (
    <Card className={classes.positionCard}>
      <CardContent>
        <Box display='flex' flexDirection='column'>
          <Box>
            <Box>
              NFT Id:{' '}
              <a
                href={`https://app.uniswap.org/pools/${position.tokenId}?chain=mumbai`}
                target='_blank'
                rel='noreferrer'
                className={classes.link}
              >
                {position.tokenId.toString()}
              </a>
            </Box>
            <Box display='flex' alignItems='center'>
              {!position.reward.isZero() ? (
                <>
                  {t('RewardsColon')}{' '}
                  <div
                    style={{
                      ...animatingStyle,
                      display: 'inline',
                      marginLeft: 4,
                    }}
                  >
                    {currentNumber} {token0Symbol}
                  </div>
                  <Tooltip
                    title='Unstake position in order to claim accrued rewards.'
                    arrow
                    placement='top'
                  >
                    <div
                      style={{
                        cursor: 'pointer',
                        display: 'inline',
                        marginLeft: 8,
                      }}
                    >
                      <InfoIcon fontSize='small' />
                    </div>
                  </Tooltip>
                </>
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
              {position.staked ? t('Unstake') : t('Stake')}{' '}
            </Button>
            <Button
              color='secondary'
              variant='contained'
              onClick={withdraw}
              className={classes.depositButton}
              disabled={position.owner === address}
            >
              {t('Withdraw')}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  ) : (
    <TableRow>
      <TableCell component='th' scope='row'>
        <a
          href={`https://app.uniswap.org/pools/${position.tokenId}?chain=mumbai`}
          target='_blank'
          rel='noreferrer'
          className={classes.link}
        >
          {position.tokenId.toString()}
        </a>
      </TableCell>
      <TableCell>
        {!position.reward.isZero() ? (
          <Box className='flex items-center'>
            <Box mr={1}>
              <div style={animatingStyle}>
                {currentNumber} {token0Symbol}
              </div>{' '}
            </Box>
            <Tooltip title={t('UnstakeToClaimRewards')} arrow placement='top'>
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
          {position.staked ? t('Unstake') : t('Stake')}{' '}
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
          {t('Withdraw')}
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
  const { t } = useTranslation();

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
      await tx(t('Claiming'), t('Claimed'), () =>
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
    <Box display='flex' flexDirection='column' alignItems='flex-end'>
      <Box mb={2}>
        <Typography
          variant='body2'
          color='textSecondary'
          component='span'
          display='block'
          align='right'
        >
          {t('RewardsColon')}{' '}
          {formatUnits(reward, currentIncentiveRewardTokenDecimals)}{' '}
          {currentIncentiveRewardTokenSymbol}
        </Typography>
      </Box>
      <Button
        color='secondary'
        variant='contained'
        onClick={claim}
        className={classes.claimButton}
        disabled={isClaiming || reward.isZero()}
        startIcon={
          isClaiming ? <CircularProgress size={24} color='inherit' /> : null
        }
      >
        {isClaiming ? t('Claiming') : t('Claim')}
      </Button>
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
