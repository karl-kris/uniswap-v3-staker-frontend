import { FC, useEffect } from 'react';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';

import { UIProvider } from 'contexts/ui';
import { WalletProvider } from 'contexts/wallet';
import { NotificationsProvider } from 'contexts/notifications';
import { ContractsProvider } from 'contexts/contracts';
import { DataProvider } from 'contexts/data';

import Layout from 'components/global/Layout';
import Notification from 'components/shared/Notification';
import Stars from 'components/shared/Stars';

import theme from 'utils/theme';

const useStyles = makeStyles((theme) => ({
  snackbar: {
    top: 70,
  },
}));

const App: FC = () => {
  const classes = useStyles();

  useEffect(() => {
    const canvas = document.querySelector('.waves') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (canvas && canvas.parentNode instanceof HTMLElement) {
      canvas.width = canvas.parentNode.offsetWidth;
      canvas.height = canvas.parentNode.offsetHeight;
    }
    const resizeCanvas = () => {
      if (canvas && canvas.parentNode instanceof HTMLElement) {
        canvas.width = canvas.parentNode.offsetWidth;
        canvas.height = canvas.parentNode.offsetHeight;
      }
    };
    const requestAnimFrame = (function () {
      return (
        window.requestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();
    let step = 0;
    let lines = [
      'rgba(0,222,255, 0.2)',
      'rgba(157,192,249, 0.2)',
      'rgba(0,168,255, 0.2)',
    ];
    function waves() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step++;
      for (let j = lines.length - 1; j >= 0; j--) {
        ctx.fillStyle = lines[j];
        let angle = ((step + j * 45) * Math.PI) / 180;
        let deltaHeight = Math.sin(angle) * 50;
        let deltaHeightRight = Math.cos(angle) * 50;
        ctx.beginPath();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        -ctx.moveTo(0, canvas.height / 2 + deltaHeight);
        ctx.bezierCurveTo(
          canvas.width / 2,
          canvas.height / 2 + deltaHeight - 50,
          canvas.width / 2,
          canvas.height / 2 + deltaHeightRight - 50,
          canvas.width,
          canvas.height / 2 + deltaHeightRight
        );
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.lineTo(0, canvas.height / 2 + deltaHeight);
        ctx.closePath();
        ctx.fill();
      }
      requestAnimFrame(waves);
    }
    waves();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <ThemeProvider {...{ theme }}>
      <CssBaseline />
      <Stars />
      <div className='circle'></div>
      <canvas className='waves'></canvas>
      <UIProvider>
        <WalletProvider>
          <ContractsProvider>
            <DataProvider>
              <SnackbarProvider
                classes={{ root: classes.snackbar }}
                maxSnack={4}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                content={(key, data) => (
                  <div>
                    <Notification id={key} notification={data} />
                  </div>
                )}
              >
                <NotificationsProvider>
                  <Layout />
                </NotificationsProvider>
              </SnackbarProvider>
            </DataProvider>
          </ContractsProvider>
        </WalletProvider>
      </UIProvider>
    </ThemeProvider>
  );
};

export default App;
