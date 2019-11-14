import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';
import Experiments from '../components/ExperimentContext/Experiments';
import Login from '../components/Login';
import TrialSets from '../components/TrialContext/TrialSets';
import ExperimentForm from '../components/ExperimentContext/ExperimentForm';
import AuthPage from '../components/AuthPage';
import AddSetForm from '../components/AddSetForm';
import DeviceTypes from '../components/DeviceContext/DeviceTypes';
import { DEVICE_TYPES, TRIAL_SETS } from '../constants/base';

const AppRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/login" component={Login} exact />
      <AuthPage>
        <Switch>
          <Redirect exact from="/" to="/experiments" />
          <Redirect exact from="/experiments/:id" to={`/experiments/:id/${TRIAL_SETS}`} />
        </Switch>
        <Route path="/experiments" component={Experiments} exact />
        <Route path="/add-experiment" component={ExperimentForm} exact />
        <Route
          path="/experiments/:id/add-trial-set"
          exact
          render={props => <AddSetForm {...props} formType={TRIAL_SETS} />}
        />
        <Route
          path="/experiments/:id/add-device-type"
          exact
          render={props => <AddSetForm {...props} formType={DEVICE_TYPES} />}
        />
        <Route path={`/experiments/:id/${TRIAL_SETS}`} component={TrialSets} exact />
        <Route path={`/experiments/:id/${DEVICE_TYPES}`} component={DeviceTypes} exact />
        {/* <Route path={`/experiments/:id/${ASSETS}`} component={Assets} exact /> */}
      </AuthPage>
    </Switch>
  </BrowserRouter>
);

export default AppRoutes;
