import React from 'react';
import { ApolloProvider } from 'react-apollo';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Graph from './apolloGraphql';
import Login from './components/Login';
import Home from './components/Home';
import TrialForm from './components/TrialContext/TrialForm';
import './App.css';
import theme from './theme';

const App = () => (
  <ApolloProvider client={new Graph().client}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Router>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/login" component={Login} />
            {/* <Route path="/experiment/:id" component={} /> */}
            <Route path="/trial/manual" component={TrialForm} />
          </Switch>
        </Router>
        {/* <div class="footer" style={{'background-color':'#dddddd'}}>
            <a href={`${config.url}/graphql`} target="_blank">GraphQL Playground</a>
          </div> */}
      </div>
    </ThemeProvider>
  </ApolloProvider>
);

export default App;
