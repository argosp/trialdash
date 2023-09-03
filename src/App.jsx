import React from 'react';
import { ApolloProvider } from 'react-apollo';
// eslint-disable-next-line
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { client } from './apolloGraphql';
import './App.css';
import theme from './theme';
import AppRoutes from './AppRoutes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

const App = () => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <CssBaseline />
        <div className="App">
          <AppRoutes />
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  </ApolloProvider>
);

export default App;
