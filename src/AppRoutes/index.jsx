import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';
import Experiments from '../components/ExperimentContext/Experiments';
import Login from '../components/Login';
import TrialSets from '../components/TrialContext/TrialSets';
import ExperimentForm from '../components/ExperimentContext/ExperimentForm';
import AuthPage from '../components/AuthPage';
import AddSetForm from '../components/AddSetForm';
import DeviceTypes from '../components/DeviceContext/DeviceTypes';
import deviceTypesQuery from '../components/DeviceContext/utils/deviceTypeQuery';
import Trials from '../components/TrialContext/Trials';
import TrialForm from '../components/TrialContext/TrialForm';
import trialSetsQuery from '../components/TrialContext/utils/trialSetQuery';
import Devices from '../components/DeviceContext/Devices';
import DeviceForm from '../components/DeviceContext/DeviceForm';
import {
  DEVICE_TYPES_DASH,
  DEVICE_TYPES,
  DEVICES,
  TRIAL_SETS_DASH,
  TRIAL_SETS,
  TRIALS,
  TRIAL_SET_MUTATION,
  DEVICE_TYPE_MUTATION,
} from '../constants/base';

const AppRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/login" component={Login} exact />
      <AuthPage>
        <Switch>
          <Redirect exact from="/" to="/experiments" />
          <Redirect
            exact
            from="/experiments/:id"
            to={`/experiments/:id/${TRIAL_SETS_DASH}`}
          />
          <Redirect
            exact
            from={`/experiments/:id/${TRIAL_SETS_DASH}/:trialSetKey`}
            to={`/experiments/:id/${TRIAL_SETS_DASH}/:trialSetKey/trials`}
          />
          <Redirect
            exact
            from={`/experiments/:id/${DEVICE_TYPES_DASH}/:deviceTypeKey`}
            to={`/experiments/:id/${DEVICE_TYPES_DASH}/:deviceTypeKey/entities`}
          />
          {/* TODO Add redirect for assets */}
        </Switch>
        <Route path="/experiments" component={Experiments} exact />
        <Route path="/add-experiment" component={ExperimentForm} exact />
        <Route
          path="/experiments/:id/add-trial-set"
          exact
          render={props => (
            <AddSetForm
              {...props}
              formType={TRIAL_SETS_DASH}
              cacheQuery={trialSetsQuery}
              itemsName={TRIAL_SETS}
              mutationName={TRIAL_SET_MUTATION}
            />
          )}
        />
        <Route
          path="/experiments/:id/add-entities-type"
          exact
          render={props => (
            <AddSetForm
              {...props}
              formType={DEVICE_TYPES_DASH}
              cacheQuery={deviceTypesQuery}
              itemsName={DEVICE_TYPES}
              mutationName={DEVICE_TYPE_MUTATION}
            />
          )}
        />
        <Route
          path={`/experiments/:id/${TRIAL_SETS_DASH}/:trialSetKey/add-trial`}
          exact
          component={TrialForm}
        />
        <Route
          path={`/experiments/:id/${DEVICE_TYPES_DASH}/:deviceTypeKey/add-entity`}
          exact
          component={DeviceForm}
        />
        <Route
          path={`/experiments/:id/${DEVICE_TYPES_DASH}/:deviceTypeKey/add-multiple-entities`}
          exact
          component={DeviceForm}
        />
        <Route
          path={`/experiments/:id/${TRIAL_SETS_DASH}`}
          component={TrialSets}
          exact
        />
        <Route
          path={`/experiments/:id/${DEVICE_TYPES_DASH}`}
          component={DeviceTypes}
          exact
        />
        {/* <Route path={`/experiments/:id/${ASSETS}`} component={Assets} exact /> */}
        <Route
          path={`/experiments/:id/${TRIAL_SETS_DASH}/:trialSetKey/${TRIALS}`}
          component={Trials}
          exact
        />
        <Route
          path={`/experiments/:id/${DEVICE_TYPES_DASH}/:deviceTypeKey/${DEVICES}`}
          component={Devices}
          exact
        />
      </AuthPage>
    </Switch>
  </BrowserRouter>
);

export default AppRoutes;
