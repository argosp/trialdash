import React, { Component } from 'react';
import { ApolloProvider } from "react-apollo";
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Graph from './apolloGraphql';

//COMPONENTS
import Login from './components/Login'
import Home from './components/Home'
import ExperimentContext from './components/ExperimentContext/MainView'
import TrialForm from './components/TrialContext/TrialForm'
import './App.css';
class App extends Component {
  render() {
    return (
      <ApolloProvider client={new Graph().client}>
        <div className="App">
          <Router>
            <Switch>
              <Route path="/" component={Home} exact={true} />
              <Route path="/login" component={Login} />
              <Route path="/experiment/:id" component={ExperimentContext} />
              <Route path="/trial/manual" component={TrialForm}/>
            </Switch>
          </Router> 
          <div class="footer">
            <a href="http://argos-graph-ingress.argos.192.116.82.73.xip.io/graphql">GraphQL Playground</a>
          </div>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
