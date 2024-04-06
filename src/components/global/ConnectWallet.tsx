import { FC, useMemo } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Dialog, Button } from '@material-ui/core';
import { Close as Icon } from '@material-ui/icons';
import { useWallet } from 'contexts/wallet';
import { AVAILABLE_NETWORKS } from 'config';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  container: {
    width: 450,
    padding: '0 20px 10px',
    lineHeight: '1.5rem',
    '& button': {
      width: '100%',
      padding: '10px 0',
      marginTop: 20,
      fontSize: 18,
    },
  },
  x: {
    position: 'absolute',
    top: 16,
    right: 16,
    cursor: 'pointer',
  },
  wallet: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    margin: '10px 0',
    '& img': {
      marginRight: 15,
    },
    '&:hover': {
      opacity: 0.8,
    },
  },
  net: {
    color: theme.palette.secondary.main,
  },
}));

function switchToEthereum(chainId: string) {
  return async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const ethereum = (window as any).ethereum;
    if (ethereum) {
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
      } catch (switchError: Error | any) {
        if (switchError.code === 4902 && chainId === '0xaa36a7') {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId,
                  rpcUrls: ['https://ethereum-sepolia.publicnode.com'],
                  chainName: 'Sepolia',
                  nativeCurrency: {
                    name: 'SepoliaETH',
                    symbol: 'SepoliaETH',
                    decimals: 18,
                  },
                  blockExplorerUrls: ['https://sepolia.etherscan.io'],
                },
              ],
            });
          } catch (addError) {
            console.error(addError);
          }
        } else {
          console.error(switchError);
        }
      }
    } else {
      console.error('MetaMask is not installed');
    }
  };
}

export const ConnectWallet: FC = () => {
  const classes = useStyles();
  const wallet = useWallet();

  const isOnCorrectNetwork = useMemo(
    () => !wallet.network || ~AVAILABLE_NETWORKS.indexOf(wallet.network),
    [wallet.network]
  );

  return (
    <Dialog
      onClose={() => {}}
      aria-labelledby='wrong-network-prompt'
      open={!isOnCorrectNetwork || wallet.isConnecting}
    >
      <div className={clsx('flex', 'flex-grow', 'flex-col', classes.container)}>
        {isOnCorrectNetwork ? (
          <>
            <div className={classes.x}>
              <Icon style={{ fontSize: 20 }} onClick={wallet.stopConnecting} />
            </div>
            <h3>Connect Wallet</h3>
            <div className={clsx('flex', 'flex-col')}>
              <div
                onClick={wallet.connectMetamask}
                className={clsx(classes.wallet)}
              >
                <img
                  src='wallets/metamask.svg'
                  width='50'
                  height='50'
                  alt='metamask'
                />
                <Typography variant='h6'>Metamask</Typography>
              </div>
              {/*
                <div onClick={wallet.connectWalletConnect} className={clsx(classes.wallet)}>
                  <img
                    src='wallets/wallet-connect.png'
                    width='35'
                    height='35'
                    alt='wallet connect'
                  />
                  <div>Wallet Connect</div>
                </div>
              */}
            </div>
          </>
        ) : (
          <Box
            mt={2}
            className={clsx(
              'flex',
              'flex-col',
              'items-center',
              'justify-center',
              'text-center'
            )}
          >
            <Typography variant='h5'>Change your wallet network</Typography>
            {/*
            <Typography variant='h6'>
              <strong>
                Please connect to {AVAILABLE_NETWORKS.join(' or ')} network.
              </strong>
              <div>or</div>
              <div className='cursor-pointer' onClick={wallet.disconnect}>
                disconnect
              </div>
              </Typography>
            */}
            <div>Make sure that your wallet is set to the Sepolia network.</div>
            <Button
              variant='contained'
              color='secondary'
              onClick={switchToEthereum('0xaa36a7')}
            >
              Switch to Sepolia
            </Button>
          </Box>
        )}
      </div>
    </Dialog>
  );
};

export default ConnectWallet;
