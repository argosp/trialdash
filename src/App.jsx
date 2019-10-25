import React from 'react';
import { ApolloProvider } from 'react-apollo';
// eslint-disable-next-line
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Graph from './apolloGraphql';
import './App.css';
import theme from './theme';
import AppRoutes from './AppRoutes';

const App = () => (
  <ApolloProvider client={new Graph().client}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppRoutes />
      </div>
    </ThemeProvider>
  </ApolloProvider>
);

export default App;
