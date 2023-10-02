import { FC } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Typography, Toolbar, Button } from '@material-ui/core';
import { useWallet } from 'contexts/wallet';
import { APP_NAME } from 'config';

const useStyles = makeStyles((theme) => ({
  container: {
    boxShadow: '3px 3px 5px 0px rgba(0,0,0,0.15)',
  },
  title: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
  account: {
    marginRight: 10,
    marginLeft: 10,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

const Header: FC = () => {
  const classes = useStyles();
  const { address, network, startConnecting, disconnect } = useWallet();

  const shortAddress =
    address && `${address.slice(0, 6)}....${address.slice(-4)}`;

  return (
    <AppBar position='fixed' color='inherit' className={classes.container}>
      <Toolbar color='inherit'>
        <Typography variant='h6' className={'flex flex-grow'}>
          <div className={'flex items-center'}>{APP_NAME}</div>
        </Typography>

        {address ? (
          <>
            &nbsp;
            <Jazzicon diameter={32} seed={jsNumberForAddress(address)} />
            <div className={classes.account}>
              {shortAddress} ({network})
            </div>
            <Button color='secondary' onClick={disconnect}>
              Disconnect
            </Button>
          </>
        ) : (
          <Button color='secondary' onClick={startConnecting}>
            Connect Wallet
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
