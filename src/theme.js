import { createMuiTheme } from '@material-ui/core/styles';
import Inter from './assets/fonts/Inter-Regular.woff';

const interFont = {
  fontFamily: 'Inter',
  fontStyle: 'normal',
  src: `
    local('Inter'),
    url(${Inter}) format('woff2')
  `,
};

export default createMuiTheme({
  typography: {
    fontFamily:
      'Inter, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [interFont],
      },
    },
  },
  palette: {
    background: {
      default: '#F5F5F5',
    },
    primary: {
      main: '#27AE60',
    },
    white: {
      main: '#fff',
    },
    black: {
      main: '#333',
    },
    gray: {
      main: '#828282',
      dark: '#4F4F4F',
    },
  },
});
