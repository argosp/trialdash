import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import { groupBy } from 'lodash';
import entitiesTypesQuery from '../../../EntityContext/utils/entityTypeQuery';
import entitiesQuery from '../../../EntityContext/Entities/utils/entityQuery';
import EntityPlanner from '../../../EntityPlanner/EntityPlanner';
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
        entities: {},
        entitiesTypes: {},
        experimentDataMaps: []
    });

    useEffect(() => {
        (async () => {
            const data = await client.query({ query: entitiesTypesQuery(match.params.id) });
            const entitiesTypes = groupBy(data.data.entitiesTypes, 'key');
            const entitiesData = await client.query({ query: entitiesQuery(match.params.id) });
            const entities = groupBy(entitiesData.data.entities, 'key');
            const experiments = await client.query({ query: experimentsQuery });
            const experimentsWithData = (experiments.data.experimentsWithData || []);
            const currentExperiment = experimentsWithData.find(experiment => experiment.project.id === trial.experimentId);
            const experimentDataMaps = currentExperiment ? currentExperiment.maps : [];
            setState({
                ...state,
                entitiesTypes,
                entities,
                experimentDataMaps,
            });
            showFooter(false);
        })()
    }, []);

    const {
        entities,
        entitiesTypes,
        experimentDataMaps,
    } = state;

    return (
        <EntityPlanner
            updateLocation={updateLocation}
            trial={trial}
            allEntities={entities}
            entitiesTypes={entitiesTypes}
            experimentDataMaps={experimentDataMaps}
            submitTrial={(updateTrial) => submitTrial(updateTrial)}
        />
    );
}

export default compose(
    withRouter,
    withApollo,
)(TrialEntities);
