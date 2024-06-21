import { createMuiTheme } from '@material-ui/core/styles';
import { BORDER_RADIUS } from 'config';

export default createMuiTheme({
  typography: {
    fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
  },
  palette: {
    type: 'dark',
    background: {
      default: '#03191f',
      paper: '#111',
    },
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#0099bf',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: BORDER_RADIUS,
        textTransform: 'none',
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: BORDER_RADIUS,
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: BORDER_RADIUS,
      },
    },
    MuiInput: {
      underline: {
        '&:before': {
          borderBottomColor: '#313131',
        },
        '&:after': {
          borderBottomColor: '#0099bf',
        },
      },
    },
  },
});
