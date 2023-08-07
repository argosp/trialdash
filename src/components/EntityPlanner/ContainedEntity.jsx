import React from 'react';
import { ButtonTooltip } from './ButtonTooltip';
import { useEntities } from './EntitiesContext';
import { Clear, VisibilityOutlined } from '@material-ui/icons';
import { Paper, Box, Typography } from '@material-ui/core';
import { usePopupSwitch } from './PopupSwitchContext';

export const ContainedEntity = ({ childEntityItemKey, disconnectEntity }) => {
    const { setEntityProperties, entities } = useEntities();
    const { switchToPopup } = usePopupSwitch();

    const search = (() => {
        for (const entityType of entities) {
            for (const entityItem of entityType.items) {
                if (entityItem.key === childEntityItemKey) {
                    return { entityType, entityItem };
                }
            }
        }
    })();

    const showEntity = () => {
        switchToPopup(childEntityItemKey);
    }

    return (
        <Paper key={childEntityItemKey} style={{
            marginTop: 5,
            marginBottom: 5,
            marginRight: 0,
            marginLeft: 0,
            paddingRight: 10,
            paddingLeft: 10,
            display: "flex",
        }}>
            <Typography
                variant='body1'
                style={{
                    margin: 0,
                    marginRight: '10px',
                    display: 'inline-block'
                }}
            >
                {!search ? 'unknown ' + childEntityItemKey : (
                    <>
                        {search.entityItem.name}
                    </>
                )}
            </Typography>
            <ButtonTooltip
                key='show'
                color='default'
                disabled={false}
                tooltip={'Show this entity'}
                onClick={showEntity}
                style={{ marginLeft: "auto" }}
            >
                <VisibilityOutlined />
            </ButtonTooltip>
            <ButtonTooltip
                key='remove'
                color='default'
                disabled={false}
                tooltip={'Disconnect this entity'}
                onClick={disconnectEntity}
                style={{ marginLeft: "auto" }}
            >
                <Clear />
            </ButtonTooltip>
        </Paper>
    )
}