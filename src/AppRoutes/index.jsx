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
  DEVICE_TYPES,
  DEVICE_TYPES_CONTENT_TYPE,
  DEVICES_CONTENT_TYPE,
  TRIAL_SETS,
  TRIAL_SETS_CONTENT_TYPE,
  TRIALS_CONTENT_TYPE,
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
            to={`/experiments/:id/${TRIAL_SETS}`}
          />
          <Redirect
            exact
            from={`/experiments/:id/${TRIAL_SETS}/:trialSetKey`}
            to={`/experiments/:id/${TRIAL_SETS}/:trialSetKey/trials`}
          />
          <Redirect
            exact
            from={`/experiments/:id/${DEVICE_TYPES}/:deviceTypeKey`}
            to={`/experiments/:id/${DEVICE_TYPES}/:deviceTypeKey/devices`}
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
              formType={TRIAL_SETS}
              cacheQuery={trialSetsQuery}
              itemsName={TRIAL_SETS_CONTENT_TYPE}
              mutationName="addUpdateTrialSet"
            />
          )}
        />
        <Route
          path="/experiments/:id/add-device-type"
          exact
          render={props => (
            <AddSetForm
              {...props}
              formType={DEVICE_TYPES}
              cacheQuery={deviceTypesQuery}
              itemsName={DEVICE_TYPES_CONTENT_TYPE}
              mutationName="addUpdateDeviceTypes"
            />
          )}
        />
        <Route
          path={`/experiments/:id/${TRIAL_SETS}/:trialSetKey/add-trial`}
          exact
          component={TrialForm}
        />
        <Route
          path={`/experiments/:id/${DEVICE_TYPES}/:deviceTypeKey/add-device`}
          exact
          component={DeviceForm}
        />
        <Route
          path={`/experiments/:id/${TRIAL_SETS}`}
          component={TrialSets}
          exact
        />
        <Route
          path={`/experiments/:id/${DEVICE_TYPES}`}
          component={DeviceTypes}
          exact
        />
        {/* <Route path={`/experiments/:id/${ASSETS}`} component={Assets} exact /> */}
        <Route
          path={`/experiments/:id/${TRIAL_SETS}/:trialSetKey/${TRIALS_CONTENT_TYPE}`}
          component={Trials}
          exact
        />
        <Route
          path={`/experiments/:id/${DEVICE_TYPES}/:deviceTypeKey/${DEVICES_CONTENT_TYPE}`}
          component={Devices}
          exact
        />
      </AuthPage>
    </Switch>
  </BrowserRouter>
);

export default AppRoutes;
