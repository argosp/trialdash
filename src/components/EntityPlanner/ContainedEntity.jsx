import React, { useState } from 'react';
import { ButtonTooltip } from './ButtonTooltip';
import { useEntities } from './EntitiesContext';
import { VisibilityOffOutlined, VisibilityOutlined, ArrowForwardIos, Clear } from '@material-ui/icons'

export const ContainedEntity = ({ parentEntityItem, childEntityItemKey }) => {
    const { setEntityProperties, setEntityLocations } = useEntities();
    const containsEntities = [parentEntityItem.containsEntities || []].flatMap(x => x);
    return (
        <div key={childEntityItemKey}>
            {childEntityItemKey}
            <ButtonTooltip
                key='remove'
                color='default'
                disabled={false}
                tooltip={'Disconnect contained entity from parent'}
                onClick={() => {
                    setEntityProperties(parentEntityItem.key, [], containsEntities.filter(e => e !== childEntityItemKey));
                }}
            >
                <Clear />
            </ButtonTooltip>
        </div>
    )
}