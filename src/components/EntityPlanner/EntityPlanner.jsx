import React from 'react';
import { withStyles } from '@material-ui/core';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { EntityEditor } from './EntityEditor';
import { styles } from './styles';
import { ShapeProvider } from './ShapeContext';
import { ShowWorking } from './ShowWorking';
import { EntitiesProvider } from './EntitiesContext';

const EntityPlanner = ({ client, trial, trialEntities, match, updateLocation, entitiesTypes, experimentDataMaps }) => {
    console.log('EntityPlanner', match.params.id, trial, trialEntities);

    return (
        <EntitiesProvider
            client={client}
            entitiesTypes={entitiesTypes}
            experimentId={match.params.id} // obtained from url by react-router
            trialEntities={trialEntities}
            updateLocation={updateLocation}
        >
            <ShapeProvider>
                <ShowWorking />
                <EntityEditor
                    experimentDataMaps={experimentDataMaps}
                />
            </ShapeProvider>
        </EntitiesProvider>
    );
}

export default compose(
    withRouter,
    withApollo,
    withStyles(styles),
)(EntityPlanner);
