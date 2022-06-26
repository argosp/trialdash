import { createTheme } from '@material-ui/core/styles';
import Inter from './assets/fonts/Inter-Regular.woff';

const interFont = {
  fontFamily: 'Inter',
  fontStyle: 'normal',
  src: `
    local('Inter'),
    url(${Inter}) format('woff2')
  `,
};

export default createTheme({
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
      contained: {
        boxShadow: 'none',
      },
      containedPrimary: {
        color: '#FFF',
        border: '1px solid transparent',

        '&:hover': {
          backgroundColor: '#2ECE72',
          boxShadow: '0 10px 16px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.06)',
        },
      },
      outlined: {
        border: '1px solid #AAA',

        '&:hover': {
          backgroundColor: '#AAA',
          color: '#FFF',
          boxShadow: '0 10px 16px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.06)',
        },
      },
      outlinedPrimary: {
        border: '1px solid #27AE60',

        '&:hover': {
          backgroundColor: '#27AE60',
          color: '#FFF',
          boxShadow: '0 10px 16px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.06)',
        },
      },
      outlinedSecondary: {
        color: '#EB5757',
        border: '1px solid #EB5757',

        '&:hover': {
          border: '1px solid transparent',
          backgroundColor: '#EB5757',
          color: '#FFF',
          boxShadow: '0 10px 16px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiPickersDay: {
      daySelected: {
        color: '#FFF',
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
      medium: '#FDFDFD',
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
      light: '#A1A1A1'
    },
    red: {
      main: '#EB5757',
    },
    blue: {
      main: '#56CCF2',
      light: '#DDF5FC',
    },
    violet: {
      main: '#BB6BD9',
    },
    orange: {
      main: '#F2994A',
    },
  },
});
