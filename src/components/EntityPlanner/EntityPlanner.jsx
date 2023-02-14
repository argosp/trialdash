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

const EntityPlanner = ({ client, trial, trialEntities, allEntities, match, updateLocation, entitiesTypes, experimentDataMaps, submitTrial }) => {
    console.log('EntityPlanner', match.params.id, trial, trialEntities);

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
