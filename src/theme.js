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
    MuiButton: {
      containedPrimary: {
        color: '#FFF',

        '&:hover': {
          backgroundColor: '#2ECE72',
        },
      },
      outlined: {
        '&:hover': {
          backgroundColor: '#AAA',
          color: '#FFF',
        },
      },
      outlinedSecondary: {
        color: '#EB5757',

        '&:hover': {
          backgroundColor: '#EB5757',
          color: '#FFF',
        },
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
      dark: '#E0E0E0',
    },
    black: {
      main: '#333',
      dark: '#000',
    },
    gray: {
      main: '#828282',
      dark: '#4F4F4F',
      medium: '#ADADAD',
      soft: '#474747',
      light: '#b3b3b3',
    },
    red: {
      main: '#EB5757',
    },
  },
});
