import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';
import Experiments from '../components/ExperimentContext/Experiments';
import Login from '../components/Login';
import TrialSets from '../components/TrialContext/TrialSets';
import AuthPage from '../components/AuthPage';

const AppRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/login" component={Login} exact />
      <AuthPage>
        <Switch>
          <Redirect exact from="/" to="/experiments" />
          <Redirect exact from="/experiments/:id" to="/experiments/:id/trialSets" />
        </Switch>
        <Route path="/experiments" component={Experiments} exact />
        <Route path="/experiments/:id/trialSets" component={TrialSets} exact />
      </AuthPage>
    </Switch>
  </BrowserRouter>
);

export default AppRoutes;
