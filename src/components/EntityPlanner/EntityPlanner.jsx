import React, { useContext, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { EntityEditor } from './EntityEditor';
import { styles } from './styles';
import { ShapeProvider } from './ShapeContext';
import { EntitiesProvider } from './EntitiesContext';
import { SelectionProvider } from './SelectionContext.jsx';
import CloneEntitiesDialog from '../CloneEntitiesDialog';
import { groupBy } from 'lodash';
import entitiesTypesQuery from '../EntityContext/utils/entityTypeQuery';
import entitiesQuery from '../EntityContext/Entities/utils/entityQuery';
import experimentsQuery from '../ExperimentContext/utils/experimentsQuery';
import { WorkingContext } from '../AppLayout';
import { ErrorBoundary } from "react-error-boundary";
import { PopupSwitchProvider } from './PopupSwitchContext';

const EntityPlanner = ({
    client,
    match,
    trial,
    updateLocation,
    submitTrial,
    showFooter,
}) => {
    console.log('EntityPlanner', match.params.id, trial);
    const cloneEntitiesRef = React.createRef();
    const { setWorking } = useContext(WorkingContext);

    const [state, setState] = useState({
        allEntities: {},
        entitiesTypes: {},
        experimentDataMaps: []
    });

    useEffect(() => {
        (async () => {
            setWorking(true);
            const data = await client.query({ query: entitiesTypesQuery(match.params.id) });
            const entitiesTypes = groupBy(data.data.entitiesTypes, 'key');
            const entitiesData = await client.query({ query: entitiesQuery(match.params.id) });
            const allEntities = groupBy(entitiesData.data.entities, 'key');
            const experiments = await client.query({ query: experimentsQuery });
            const experimentsWithData = (experiments.data.experimentsWithData || []);
            const currentExperiment = experimentsWithData.find(experiment => experiment.project.id === trial.experimentId);
            const experimentDataMaps = currentExperiment ? currentExperiment.maps : [];
            setState({
                ...state,
                entitiesTypes,
                allEntities,
                experimentDataMaps,
            });
            showFooter(false);
            setWorking(false);
        })()
    }, []);

    const trialEntities = trial[trial.status === 'deploy' ? 'deployedEntities' : 'entities'];
    const trialEntitiesGrouped = groupBy(trialEntities, 'entitiesTypeKey');

    return (
        <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => (
            <div role="alert">
                {/* <p>Something went wrong:</p> */}
                <pre style={{ color: "red" }}>{error.message}<br />{error.componentStack}</pre>
                <button onClick={resetErrorBoundary} >Retry</button>
                <pre>{JSON.stringify(trialEntities, null, 2)}</pre>
            </div>
        )}>
            <EntitiesProvider
                client={client}
                entitiesTypes={state.entitiesTypes}
                experimentId={match.params.id} // obtained from url by react-router
                trialEntities={trialEntities}
                updateLocation={updateLocation}
                submitTrial={(updateTrial) => submitTrial(updateTrial)}
                trial={trial}
                allEntities={state.allEntities}
            >
                <PopupSwitchProvider>
                    <SelectionProvider>
                        <ShapeProvider>
                            <EntityEditor
                                experimentDataMaps={state.experimentDataMaps}
                                cloneEntitiesDialog={
                                    <CloneEntitiesDialog
                                        title={"Clone trial"}
                                        ref={cloneEntitiesRef}
                                        onConfirm={submitTrial}
                                        entitiesTypes={state.entitiesTypes}
                                        trialEntities={trialEntitiesGrouped}
                                        currentTrial={trial}
                                        client={client}
                                        match={match}
                                    />
                                }
                            />
                        </ShapeProvider>
                    </SelectionProvider>
                </PopupSwitchProvider>
            </EntitiesProvider>
        </ErrorBoundary>
    );
}

export default compose(
    withRouter,
    withApollo,
    withStyles(styles),
)(EntityPlanner);