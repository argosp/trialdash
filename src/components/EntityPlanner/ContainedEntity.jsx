import React from 'react';
import { ButtonTooltip } from './ButtonTooltip';
import { useEntities } from './EntitiesContext';
import { Clear } from '@material-ui/icons';
import { Paper, Box, Typography } from '@material-ui/core';

export const ContainedEntity = ({ parentEntityItem, childEntityItemKey }) => {
    const { setEntityProperties, entities } = useEntities();

    const search = (() => {
        for (const entityType of entities) {
            for (const entityItem of entityType.items) {
                if (entityItem.key === childEntityItemKey) {
                    return { entityType, entityItem };
                }
            }
        }
    })();

    const disconnectEntity = () => {
        const containsEntities = [parentEntityItem.containsEntities || []].flatMap(x => x);
        const newContainsEntities = containsEntities.filter(e => e !== childEntityItemKey);
        setEntityProperties(parentEntityItem.key, [], newContainsEntities);
    }

    return (
        <Paper key={childEntityItemKey} style={{
            marginTop: 5,
            marginBottom: 5,
            marginRight: 0,
            marginLeft: 0,
            // paddingTop: 2,
            // paddingBottom: 2,
            paddingRight: 10,
            paddingLeft: 10,
            display: "flex",
        }}>
            {/* <Paper style={{ marginRight: 2 }}> */}
            <Typography
                variant='body1'
                style={{ margin: 0, display: 'inline-block' }}
            >
                {!search ? 'unknown ' + childEntityItemKey : (
                    <>
                        {search.entityItem.name}
                    </>
                )}
            </Typography>
            {/* </Paper> */}
            {/* <Paper style={{ marginRight: 2 }}>
                <Typography
                    variant='body1'
                    style={{ margin: 0, display: 'inline-block' }}
                >
                    {!search ? 'unknown ' + childEntityItemKey : (
                        <>
                            {search.entityType.name}
                        </>
                    )}
                </Typography>
            </Paper> */}
            <ButtonTooltip
                key='remove'
                color='default'
                disabled={false}
                tooltip={'Disconnect contained entity from parent'}
                onClick={disconnectEntity}
                style={{ marginLeft: "auto" }}
            >
                <Clear />
            </ButtonTooltip>
        </Paper>
    )
}