import React from 'react';
import { withStyles } from '@material-ui/core';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { EntityEditor } from './EntityEditor';
import { styles } from './styles';
import { ShapeProvider } from './ShapeContext';
import { EntitiesProvider } from './EntitiesContext';
import { StagingProvider } from './StagingContext.jsx';
import CloneEntitiesDialog from '../CloneEntitiesDialog';
import { groupBy } from 'lodash';

const EntityPlanner = ({
    client,
    match,
    trial,
    allEntities,
    updateLocation,
    entitiesTypes,
    experimentDataMaps,
    submitTrial,
}) => {
    console.log('EntityPlanner', match.params.id, trial);
    const cloneEntitiesRef = React.createRef();
    const trialEntities = trial[trial.status === 'deploy' ? 'deployedEntities' : 'entities'];
    const trialEntitiesGrouped = groupBy(trialEntities, 'entitiesTypeKey');

    return (
        <EntitiesProvider
            client={client}
            entitiesTypes={entitiesTypes}
            experimentId={match.params.id} // obtained from url by react-router
            trialEntities={trialEntities}
            updateLocation={updateLocation}
            submitTrial={submitTrial}
            trial={trial}
            allEntities={allEntities}
        >
            <StagingProvider>
                <ShapeProvider>
                    <EntityEditor
                        experimentDataMaps={experimentDataMaps}
                        cloneEntitiesDialog={
                            <CloneEntitiesDialog
                                title={"Clone trial"}
                                ref={cloneEntitiesRef}
                                onConfirm={submitTrial}
                                entitiesTypes={entitiesTypes}
                                trialEntities={trialEntitiesGrouped}
                                currentTrial={trial}
                                client={client}
                                match={match}
                            />
                        }
                    />
                </ShapeProvider>
            </StagingProvider>
        </EntitiesProvider>
    );
}

export default compose(
    withRouter,
    withApollo,
    withStyles(styles),
)(EntityPlanner);
