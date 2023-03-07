/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import { groupBy } from 'lodash';
import entitiesTypesQuery from '../../../EntityContext/utils/entityTypeQuery';
import entitiesQuery from '../../../EntityContext/Entities/utils/entityQuery';
import EntityPlanner from '../../../EntityPlanner/EntityPlanner';
import CloneEntitiesDialog from '../../../CloneEntitiesDialog';
import experimentsQuery from '../../../ExperimentContext/utils/experimentsQuery';

const TrialEntities = ({
    client,
    match,
    showFooter,
    trial,
    updateLocation,
    submitTrial,
}) => {
    const [state, setState] = useState({
        // trialEntities: {},
        entities: {},
        entitiesTypes: {},
        // isLoading: true,
        // parentEntity: {},
        experimentDataMaps: []
    });

    const entitiesField = trial.status === 'deploy' ? 'deployedEntities' : 'entities';

    const cloneEntitiesRef = React.createRef();

    useEffect(() => {
        (async () => {
            const data = await client.query({ query: entitiesTypesQuery(match.params.id) });
            const entitiesTypes = groupBy(data.data.entitiesTypes, 'key');
            const entitiesData = await client.query({ query: entitiesQuery(match.params.id) });
            const entities = groupBy(entitiesData.data.entities, 'key');
            // this.orderEntities();
            const experiments = await client.query({ query: experimentsQuery });
            const currentExperiment = (experiments.data.experimentsWithData || []).find(experiment => experiment.project.id === trial.experimentId);
            const experimentDataMaps = currentExperiment ? currentExperiment.maps : [];
            setState({
                ...state,
                entitiesTypes,
                entities,
                experimentDataMaps,
                // isLoading: false
            });
            showFooter(false);
        })()
    }, []);

    // useEffect(() => {
    //     setState({
    //         ...state,
    //         update: true,
    //         trialEntities: groupBy(trial[entitiesField], 'entitiesTypeKey'),
    //         entitiesField
    //     });
    // }, [trial, entitiesField, trial.status, trial[entitiesField]]);

    // componentDidUpdate(prevProps) {
    //     if (prevProps.triggerUpdate !== this.props.triggerUpdate ||
    //         prevProps.trial[entitiesField].length !== this.props.trial[entitiesField].length ||
    //         prevProps.trial[entitiesField].length !== this.state.length ||
    //         prevProps.trial.status !== trial.status ||
    //         this.state.entitiesField !== entitiesField) {
    //         this.orderEntities();
    //     }
    // }

    // orderEntities = () => {
    //     this.setState({
    //         update: true,
    //         length: trial[entitiesField].length,
    //         trialEntities: groupBy(trial[entitiesField], 'entitiesTypeKey'),
    //         entitiesField
    //     });
    // }

    // render() {

    const {
        entities,
        entitiesTypes,
        // isLoading,
        // trialEntities,
        experimentDataMaps,
    } = state;

    const trialEntities = groupBy(trial[entitiesField], 'entitiesTypeKey');

    // let experimentDataMaps = [];
    // if (!isLoading) {
    //     const _experimentsQuery = client.readQuery({ query: experimentsQuery });
    //     experiments = _experimentsQuery.experimentsWithData;
    //     console.log(experiments);
    // }

    // const currentExperiment = experiments ? experiments.find(experiment => experiment.project.id === trial.experimentId) : '';

    return (
        <EntityPlanner
            updateLocation={updateLocation}
            trial={trial}
            trialEntities={trial[trial.status === 'deploy' ? 'deployedEntities' : 'entities']}
            allEntities={entities}
            entitiesTypes={entitiesTypes}
            experimentDataMaps={experimentDataMaps}
            submitTrial={(updateTrial) => submitTrial(updateTrial)}
            cloneEntitiesDialog={
                <CloneEntitiesDialog
                    title={"Clone trial"}
                    ref={cloneEntitiesRef}
                    onConfirm={(updateTrial) => submitTrial(updateTrial)}
                    entitiesTypes={entitiesTypes}
                    trialEntities={trialEntities}
                    currentTrial={trial}
                    client={client}
                    match={match}
                >
                </CloneEntitiesDialog>
            }
            openCloneEntitiesDialog={() => cloneEntitiesRef.current.openDialog()}
        />
    );
}

export default compose(
    withRouter,
    withApollo,
)(TrialEntities);
