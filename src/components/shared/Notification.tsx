import { FC, useMemo } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import {
  ArrowUpward as TxIcon,
  Done as SuccessIcon,
  Clear as ErrorIcon,
  Close as CloseIcon,
} from '@material-ui/icons';
import { SnackbarKey, useSnackbar } from 'notistack';
import { useWallet } from 'contexts/wallet';
import { EXPLORER_URLS } from 'config';

const useStyles = makeStyles((theme) => ({
  paper: {
    color: 'white',
    borderRadius: 10,
  },
  container: {
    padding: '10px 40px 10px 20px',
    maxWidth: 300,
    borderRadius: 4,
    '& a': {
      color: 'white',
      display: 'block',
      textDecoration: 'none',
    },
  },
  icon: {
    // border: '1px solid',
    // borderRadius: '50%',
    // padding: 10,
    marginRight: 10,
    display: 'inline-flex',
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
    cursor: 'pointer',
  },
  tx: {
    background: '#051d27',
  },
  error: {
    background: '#d32f2f',
    color: 'white',
  },
  success: {
    background: '#96ce8f',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  link: {
    fontSize: 12,
    color: 'cyan!important',
  },
  underline: {
    textDecoration: 'underline',
  },
}));

const Notification: FC<{ id: SnackbarKey; notification: any }> = ({
  id,
  notification,
}) => {
  const classes = useStyles();
  const { closeSnackbar } = useSnackbar();
  const clearNotification = () => closeSnackbar(id);

  const TYPES: Map<string, any[]> = new Map([
    ['tx', [TxIcon, TxContent]],
    ['error', [ErrorIcon, ErrorContent]],
    ['success', [SuccessIcon, SuccessContent]],
  ]);

  const [, Content] = TYPES.get(notification.type)!;

  const notificationClass = useMemo(() => {
    const c: Record<string, any> = {
      tx: classes.tx,
      error: classes.error,
      success: classes.success,
    };
    return c[notification.type]!;
  }, [notification.type, classes.error, classes.success, classes.tx]);

  return (
    <Paper className={clsx(classes.paper, notificationClass)}>
      <div className={classes.close} onClick={clearNotification}>
        <CloseIcon style={{ fontSize: 18 }} />
      </div>
      <div
        className={clsx('flex', 'flex-grow', 'items-center', classes.container)}
      >
        <div
          className={clsx('flex', 'flex-grow', 'flex-col', 'justify-center')}
        >
          <Content {...{ notification }} />
        </div>
      </div>
    </Paper>
  );
};

const TxContent: FC<{ notification: any }> = ({ notification }) => {
  const classes = useStyles();
  const { network } = useWallet();

  const validNetwork = network || Object.keys(EXPLORER_URLS)[0];
  const explorerUrl = EXPLORER_URLS[validNetwork]
    ? EXPLORER_URLS[validNetwork]
    : EXPLORER_URLS[Object.keys(EXPLORER_URLS)[0]];

  return (
    <>
      <strong className={classes.title}>{notification.description}</strong>

      <a
        href={`${explorerUrl}/tx/${notification.hash}`}
        target='_blank'
        rel='noopener noreferrer'
        className={clsx(classes.link, classes.underline)}
      >
        {notification.hash.substring(0, 20)}...
      </a>
    </>
  );
};

const ErrorContent: FC<{ notification: any }> = ({ notification }) => {
  const classes = useStyles();
  return (
    <>
      <strong className={classes.error}>{notification.message}</strong>
    </>
  );
};

const SuccessContent: FC<{ notification: any }> = ({ notification }) => {
  const classes = useStyles();
  return (
    <>
      <div>{notification.title}</div>
      <strong className={clsx(classes.small, classes.success)}>
        {notification.message}
      </strong>
    </>
  );
};

export default Notification;
