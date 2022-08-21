import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';
import Experiments from '../components/ExperimentContext/Experiments';
import Login from '../components/Login';
import TrialSets from '../components/TrialContext/TrialSets';
import ExperimentForm from '../components/ExperimentContext/ExperimentForm';
import AuthPage from '../components/AuthPage';
import AddSetForm from '../components/AddSetForm';
import EntitiesTypes from '../components/EntityContext/EntitiesTypes';
import entitiesTypesQuery from '../components/EntityContext/utils/entityTypeQuery';
import Trials from '../components/TrialContext/Trials';
import TrialForm from '../components/TrialContext/TrialForm';
import trialSetsQuery from '../components/TrialContext/utils/trialSetQuery';
import Entities from '../components/EntityContext/Entities';
import Logs from '../components/LogsContext/Logs';
import NewLog from '../components/LogsContext/NewLog';
import EditLog from '../components/LogsContext/EditLog';
import EntityForm from '../components/EntityContext/EntityForm';
import {
  ENTITIES_TYPES_DASH,
  ENTITIES_TYPES,
  ENTITIES,
  TRIAL_SETS_DASH,
  TRIAL_SETS,
  TRIALS,
  TRIAL_SET_MUTATION,
  ENTITIES_TYPE_MUTATION,
  LOGS_DASH,
} from '../constants/base';

const AppRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/login" component={Login} exact />
      <AuthPage>
        <Switch>
          <Redirect exact from="/" to="/experiments" />
          <Redirect exact from="/experiments/:id" to={`/experiments/:id/${TRIAL_SETS_DASH}`} />
          <Redirect
            exact
            from={`/experiments/:id/${TRIAL_SETS_DASH}/:trialSetKey`}
            to={`/experiments/:id/${TRIAL_SETS_DASH}/:trialSetKey/trials`}
          />
          <Redirect
            exact
            from={`/experiments/:id/${ENTITIES_TYPES_DASH}/:entitiesTypeKey`}
            to={`/experiments/:id/${ENTITIES_TYPES_DASH}/:entitiesTypeKey/entities`}
          />
          {/* TODO Add redirect for assets */}
        </Switch>
        <Route path="/experiments" component={Experiments} exact />
        <Route path="/add-experiment" component={ExperimentForm} exact />
        <Route
          path="/experiments/:id/add-trial-set"
          exact
          render={(props) => (
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
          render={(props) => (
            <AddSetForm
              {...props}
              formType={ENTITIES_TYPES_DASH}
              cacheQuery={entitiesTypesQuery}
              itemsName={ENTITIES_TYPES}
              mutationName={ENTITIES_TYPE_MUTATION}
            />
          )}
        />
        <Route
          path={`/experiments/:id/${TRIAL_SETS_DASH}/:trialSetKey/add-trial`}
          exact
          component={TrialForm}
        />
        <Route
          path={`/experiments/:id/${ENTITIES_TYPES_DASH}/:entitiesTypeKey/add-entity`}
          exact
          component={EntityForm}
        />
        <Route
          path={`/experiments/:id/${ENTITIES_TYPES_DASH}/:entitiesTypeKey/add-multiple-entities`}
          exact
          component={EntityForm}
        />
        <Route path={`/experiments/:id/${TRIAL_SETS_DASH}`} component={TrialSets} exact />
        <Route path={`/experiments/:id/${ENTITIES_TYPES_DASH}`} component={EntitiesTypes} exact />
        {/* <Route path={`/experiments/:id/${ASSETS}`} component={Assets} exact /> */}
        <Route
          path={`/experiments/:id/${TRIAL_SETS_DASH}/:trialSetKey/${TRIALS}`}
          component={Trials}
          exact
        />
        <Route
          path={`/experiments/:id/${ENTITIES_TYPES_DASH}/:entitiesTypeKey/${ENTITIES}`}
          component={Entities}
          exact
        />
        <Route path={`/experiments/:id/${LOGS_DASH}`} component={Logs} exact />
        <Route path={`/experiments/:id/${LOGS_DASH}/new`} exact component={NewLog} />
        <Route
          path={`/experiments/:id/${LOGS_DASH}/:logKey([0-9a-zA-Z-]{5,})`}
          exact
          component={EditLog}
        />
      </AuthPage>
    </Switch>
  </BrowserRouter>
);

export default AppRoutes;
