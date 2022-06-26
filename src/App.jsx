import React from 'react';
import { ApolloProvider } from 'react-apollo';
// eslint-disable-next-line
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { client } from './apolloGraphql';
import MomentUtils from '@date-io/moment';
import './App.css';
import theme from './theme';
import AppRoutes from './AppRoutes';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

const App = () => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <CssBaseline />
      <div className="App">
        <AppRoutes />
      </div>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </ApolloProvider>
);

export default App;
