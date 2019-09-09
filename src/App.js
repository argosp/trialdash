import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";

import Graph from "./apolloGraphql";
import config from "./config";

//COMPONENTS
import Login from "./components/Login";
import Home from "./components/Home";
import ExperimentContext from "./components/ExperimentContext/MainView";
import TrialForm from "./components/TrialContext/TrialForm";
import "./App.css";
import theme from "./theme";

class App extends Component {
  render() {
    return (
      <ApolloProvider client={new Graph().client}>
        <ThemeProvider theme={theme}>
          <div className="App">
            <Router>
              <Switch>
                <Route path="/" component={Home} exact={true} />
                <Route path="/login" component={Login} />
                <Route path="/experiment/:id" component={ExperimentContext} />
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
  }
}

export default App;
