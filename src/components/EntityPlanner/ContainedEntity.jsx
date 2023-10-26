import React from 'react';
import { ButtonTooltip } from './ButtonTooltip';
import { useEntities } from './EntitiesContext';
import {
    Clear,
    NearMe
} from '@mui/icons-material';
import {
    Paper,
    Typography
} from '@mui/material';
import { usePopupSwitch } from './PopupSwitchContext';

export const ContainedEntity = ({
    childEntityItemKey,
    disconnectEntity,
}) => {
    const { entities } = useEntities();
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
                <NearMe />
            </ButtonTooltip>
            <ButtonTooltip
                key='remove'
                color='secondary'
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