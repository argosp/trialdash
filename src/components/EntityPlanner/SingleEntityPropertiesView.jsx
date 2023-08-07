import React, { useState } from 'react';
import {
    Grid, Typography
} from '@material-ui/core';
import {
    Check,
    Close,
    MergeType,
} from "@material-ui/icons";
import { PenIcon } from '../../constants/icons';
import { useEntities } from './EntitiesContext.jsx';
import { ButtonTooltip } from './ButtonTooltip.jsx';
import { TextFieldEntityProperty, entitySaveForTextFields } from './TextFieldEntityProperty';
import { useSelection } from './SelectionContext';
import { ContainedEntity } from './ContainedEntity';

export const SingleEntityPropertiesView = ({ entityType, entityItem, devLocation, children }) => {
    const { setEntityProperties, setEntityLocations, entities } = useEntities();
    const { selection, popTopSelection } = useSelection();
    const [isEditLocation, setIsEditLocation] = useState(false);
    const [changedValues, setChangedValues] = useState({});

    const propertyKeys = entityType.properties
        .filter(({ type }) => isEditLocation ? true : type !== 'location')
        .flatMap(({ key, type }) => type === 'location' ? [key + '_lat', key + '_lng'] : [key]);

    const allSame = !Object.values(changedValues).some(v => v !== undefined);

    const handleSaveEntityProperties = () => {
        entitySaveForTextFields({ entityType, entityItem, changedValues, setEntityProperties, setEntityLocations });
        setChangedValues({});
        setIsEditLocation(false);
    }

    const containsEntities = [entityItem.containsEntities || []].flatMap(x => x);

    // TODO: move to useEntities and maybe optimize by precalc
    const findEntityParent = (containedKey) => {
        for (const et of entities) {
            for (const ei of et.items) {
                if (ei.containsEntities && ei.containsEntities.includes(containedKey)) {
                    return ei;
                }
            }
        }
        return undefined;
    }

    const disconnectEntityParent = (parentEntityObj, newContainedEntityKey) => {
        const containsEntities = [parentEntityObj.containsEntities || []].flatMap(x => x);
        const newContainsEntities = containsEntities.filter(ce => ce !== newContainedEntityKey);
        setEntityProperties(parentEntityObj.key, [], newContainsEntities);
    }

    const parentEntity = findEntityParent(entityItem.key);

    return (
        <>
            <Typography variant='h6'>
                {entityItem.name}
            </Typography>
            {
                isEditLocation
                    ? null
                    : <>
                        <Typography variant='overline'>
                            {'at (' + devLocation.map(x => Math.round(x * 1e7) / 1e7) + ')'}
                        </Typography>
                        <ButtonTooltip tooltip={'Edit location'} onClick={() => setIsEditLocation(true)}>
                            <PenIcon />
                        </ButtonTooltip>
                    </>
            }
            <Grid container
                direction='column'
                spacing={1}
            >
                {
                    propertyKeys.map(key => (
                        <Grid item
                            key={key}
                        >
                            <TextFieldEntityProperty
                                entityItem={entityItem}
                                entityType={entityType}
                                propertyKey={key}
                                changedValue={changedValues[key]}
                                setChangedValue={newVal => setChangedValues({ ...changedValues, [key]: newVal })}
                            />
                        </Grid>
                    ))
                }
            </Grid>
            <ButtonTooltip
                key='check'
                color='primary'
                disabled={allSame}
                tooltip={'Save entity properties'}
                onClick={() => handleSaveEntityProperties()}
            >
                <Check />
            </ButtonTooltip>
            <ButtonTooltip
                key='close'
                color='secondary'
                disabled={allSame}
                tooltip={'Revert entity properties'}
                onClick={() => { setChangedValues({}); setIsEditLocation(false); }}
            >
                <Close />
            </ButtonTooltip>
            <ButtonTooltip
                key='merge'
                color='primary'
                disabled={false}
                tooltip={'Add contained entity'}
                onClick={() => {
                    if (selection.length) {
                        const newContained = popTopSelection();
                        const newContainedParent = findEntityParent(newContained);
                        if (newContainedParent) {
                            disconnectEntityParent(newContainedParent, newContained)
                        }
                        setEntityProperties(entityItem.key, [], [...containsEntities, newContained]);
                    }
                }}
            >
                <MergeType />
            </ButtonTooltip>
            {children}
            {parentEntity === undefined ? null :
                <>
                    <br />
                    parent:
                    <br />
                    <ContainedEntity
                        childEntityItemKey={parentEntity.key}
                        disconnectEntity={() => disconnectEntityParent(parentEntity, entityItem.key)}
                    />
                </>
            }
            {containsEntities.length === 0 ? null :
                <>
                    <br />
                    contained:
                    {containsEntities.map(e => (
                        <ContainedEntity
                            childEntityItemKey={e}
                            disconnectEntity={() => disconnectEntityParent(entityItem, e)}
                        />
                    ))}
                </>
            }
        </>
    )
}