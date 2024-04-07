import { FC, useState } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Typography,
  Toolbar,
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { useWallet } from 'contexts/wallet';
import { APP_NAME } from 'config';
import { useTranslation } from 'react-i18next';

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
  flagIcon: {
    height: '16px',
    marginRight: '8px',
    border: '1px solid',
  },
  btn: {
    marginLeft: 10,
    marginRight: 10,
    color: 'cyan',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
    },
    fontWeight: 'bold',
    textTransform: 'none',
  },
}));

const Header: FC = () => {
  const classes = useStyles();
  const { address, startConnecting, disconnect } = useWallet();
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const shortAddress =
    address && `${address.slice(0, 6)}....${address.slice(-4)}`;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    handleClose();
  };

  const languages = [
    { code: 'de', name: 'Deutsch', flagSrc: '/flags/de.svg' },
    { code: 'en', name: 'English', flagSrc: '/flags/en.svg' },
    { code: 'es', name: 'Español', flagSrc: '/flags/es.svg' },
    { code: 'fr', name: 'Français', flagSrc: '/flags/fr.svg' },
    { code: 'it', name: 'Italiano', flagSrc: '/flags/it.svg' },
    { code: 'pt', name: 'Português Brasileiro', flagSrc: '/flags/pt.svg' },
  ];

  return (
    <AppBar position='fixed' color='inherit' className={classes.container}>
      <Toolbar color='inherit'>
        <Typography variant='h6' className={'flex flex-grow'}>
          <div className={'flex items-center'}>{APP_NAME}</div>
        </Typography>

        <Button
          aria-controls='language-menu'
          aria-haspopup='true'
          onClick={handleMenu}
          className={classes.btn}
        >
          {i18n.language.substring(0, 2).toUpperCase()}
        </Button>
        <Menu
          id='language-menu'
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {languages.map((language) => (
            <MenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
            >
              <img src={language.flagSrc} alt='' className={classes.flagIcon} />
              {language.name}
            </MenuItem>
          ))}
        </Menu>

        {address ? (
          <>
            &nbsp;
            <Jazzicon diameter={32} seed={jsNumberForAddress(address)} />
            <div className={classes.account}>{shortAddress}</div>
            <Button
              color='secondary'
              className={classes.btn}
              onClick={disconnect}
            >
              {t('Disconnect')}
            </Button>
          </>
        ) : (
          <Button
            color='secondary'
            className={classes.btn}
            onClick={startConnecting}
          >
            {t('ConnectWallet')}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
