/* eslint-disable prefer-destructuring */
import React from 'react';
import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import { groupBy } from 'lodash';
import entitiesTypesQuery from '../../../EntityContext/utils/entityTypeQuery';
import entitiesQuery from '../../../EntityContext/Entities/utils/entityQuery';
import { styles } from '../styles';
import EntityPlanner from '../../../EntityPlanner/EntityPlanner';
import CloneEntitiesDialog from '../../../CloneEntitiesDialog';
import experimentsQuery from '../../../ExperimentContext/utils/experimentsQuery';

class TrialEntities extends React.Component {
    state = {
        trialEntities: {},
        entities: {},
        entitiesTypes: {},
        isLoading: true,
        parentEntity: {},
        parentLocation: '',
        CloneEntitiesDialogOpen: false
    };

    componentDidMount() {
        (async () => {
            const { client, match, showFooter } = this.props;
            const data = await client.query({ query: entitiesTypesQuery(match.params.id) });
            const entitiesTypes = groupBy(data.data.entitiesTypes, 'key');
            let entities = [];
            const entitiesData = await client.query({ query: entitiesQuery(match.params.id) });
            entities = entitiesData.data.entities;
            this.setState({
                entitiesTypes,
                entities: groupBy(entities, 'key'),
            });
            this.orderEntities();
            await client.query({ query: experimentsQuery });
            this.setState({ isLoading: false });
            showFooter(false);
            this.cloneEntitiesRef = React.createRef();
        })()
    }

    componentDidUpdate(prevProps) {

        const { trial } = this.props;
        const entitiesField = trial.status === 'deploy' ? 'deployedEntities' : 'entities';
        if (prevProps.triggerUpdate !== this.props.triggerUpdate || prevProps.trial[entitiesField].length !== this.props.trial[entitiesField].length || prevProps.trial[entitiesField].length !== this.state.length || prevProps.trial.status !== trial.status || this.state.entitiesField !== entitiesField) {
            this.orderEntities();
        }
    }

    orderEntities = () => {
        const { trial } = this.props;
        const entitiesField = trial.status === 'deploy' ? 'deployedEntities' : 'entities';
        this.setState({
            update: true,
            length: trial[entitiesField].length,
            trialEntities: groupBy(trial[entitiesField], 'entitiesTypeKey'),
            entitiesField
        });
    }

    render() {

        const {
            match,
            trial,
            updateLocation,
            submitTrial,
            client,
        } = this.props;
        const {
            entities,
            entitiesTypes,
            isLoading,
            trialEntities,
        } = this.state;
        const experiments = !isLoading
            ? client.readQuery({ query: experimentsQuery }).experimentsWithData
            : [];
        const currentExperiment = experiments ? experiments.find(experiment => experiment.project.id === trial.experimentId) : '';
        return (
            <EntityPlanner
                updateLocation={updateLocation}
                trial={trial}
                trialEntities={trial[trial.status === 'deploy' ? 'deployedEntities' : 'entities']}
                allEntities={entities}
                entitiesTypes={entitiesTypes}
                experimentDataMaps={currentExperiment ? currentExperiment.maps : []}
                submitTrial={(updateTrial) => submitTrial(updateTrial)}
                cloneEntitiesDialog={
                    <CloneEntitiesDialog
                        title={"Clone trial"}
                        ref={this.cloneEntitiesRef}
                        onConfirm={(updateTrial) => submitTrial(updateTrial)}
                        entitiesTypes={entitiesTypes}
                        trialEntities={trialEntities}
                        currentTrial={trial}
                        client={client}
                        match={match}
                    >
                    </CloneEntitiesDialog>
                }
                openCloneEntitiesDialog={() => this.cloneEntitiesRef.current.openDialog()}
            />
        );
    }
}

export default compose(
    withRouter,
    withApollo,
)(TrialEntities);
