import React, { useState } from 'react';
import {
    TableRow,
    TableCell, IconButton
} from '@material-ui/core';
import {
    Check,
    Close,
} from "@material-ui/icons";
import { useEntities } from './EntitiesContext';
import { TextFieldEntityProperty, entitySaveForTextFields } from './TextFieldEntityProperty';
import { ContextMenu } from './ContextMenu';

export const EntityRow = ({ entityItem, entityType, onClick, showProperties, nameMenuItems, children }) => {
    const { setEntityProperties, setEntityLocations } = useEntities();

    const [changedValues, setChangedValues] = useState({});
    const propertyKeys = entityType.properties.flatMap(({ key, type }) => type === 'location' ? [key + '_lat', key + '_lng'] : [key]);

    const handleSaveEntityProperties = () => {
        entitySaveForTextFields({ entityType, entityItem, changedValues, setEntityProperties, setEntityLocations });
        setChangedValues({});
    }

    return (
        <TableRow
            key={entityItem.key}
        >
            <TableCell
                onClick={onClick}
            >
                <ContextMenu
                    menuItems={nameMenuItems}
                    child={entityItem.name}
                />
            </TableCell>
            {
                !showProperties ? null :
                    propertyKeys.map(key => (
                        <TableCell
                            style={{ textAlign: 'center' }}
                            key={key}
                        >
                            <TextFieldEntityProperty
                                entityItem={entityItem}
                                entityType={entityType}
                                propertyKey={key}
                                changedValue={changedValues[key]}
                                setChangedValue={newVal => setChangedValues({ ...changedValues, [key]: newVal })}
                            />
                        </TableCell>
                    ))
            }
            <TableCell align="right" padding='none'>
                {!showProperties || !Object.values(changedValues).some(v => v !== undefined)
                    ? null
                    : <>
                        <IconButton color='primary' size="small" key='save'
                            onClick={() => handleSaveEntityProperties()}
                        >
                            <Check />
                        </IconButton>
                        <IconButton color='secondary' size="small" key='revert'
                            onClick={() => setChangedValues({})}
                        >
                            <Close />
                        </IconButton>
                    </>
                }
                {children}
            </TableCell>
        </TableRow>
    )
}