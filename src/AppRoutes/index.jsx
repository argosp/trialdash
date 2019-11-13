import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';
import Experiments from '../components/ExperimentContext/Experiments';
import Login from '../components/Login';
import TrialSets from '../components/TrialContext/TrialSets';
import ExperimentForm from '../components/ExperimentContext/ExperimentForm';
import AuthPage from '../components/AuthPage';

const AppRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/login" component={Login} exact />
      <AuthPage>
        <Switch>
          <Redirect exact from="/" to="/experiments" />
          <Redirect exact from="/experiments/:id" to="/experiments/:id/trial-sets" />
        </Switch>
        <Route path="/experiments" component={Experiments} exact />
        <Route path="/add-experiment" component={ExperimentForm} exact />
        <Route path="/experiments/:id/trial-sets" component={TrialSets} exact />
      </AuthPage>
    </Switch>
  </BrowserRouter>
);

export default AppRoutes;
