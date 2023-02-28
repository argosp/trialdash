import React, { useState } from 'react';
import {
    TableRow,
    TableCell,
    TextField,
    IconButton,
} from '@material-ui/core';
import {
    Check,
    Close,
} from "@material-ui/icons";
import { useEntities } from './EntitiesContext';

export const EntityRow = ({ entityItem, entityType, isSelected, onClick, showProperties, children }) => {
    const { setEntityProperties } = useEntities();

    const savedValues = entityType.properties.filter(({ type, trialField }) => trialField && type !== 'location')
        .map(({ key: typePropertyKey, label, defaultValue }) => {
            const valprop = entityItem.properties.find(({ key: itemPropertyKey }) => itemPropertyKey === typePropertyKey);
            let val = '';
            if (valprop && valprop.val !== undefined && valprop.val !== null) {
                val = valprop.val;
            } else if (defaultValue !== null && defaultValue !== undefined) {
                val = defaultValue;
            }
            return { key: typePropertyKey, label, val };
        });

    const [shownValues, setShownValues] = useState(savedValues);

    const changedValues = shownValues.filter(({ val }, i) => (savedValues[i].val + '').trim() !== (val + '').trim());
    const allSame = changedValues.length === 0;

    return (
        <TableRow
            key={entityItem.key}
        >
            <TableCell
                // style={{ fontWeight: isOpenArrow ? 'bolder' : 'normal' }}
                button
                // selected={isSelected}
                onClick={onClick}
            >
                {entityItem.name}
            </TableCell>
            {
                !showProperties ? null :
                    shownValues.map(({ key: propertyKey, label, val }, i) => (
                        <TableCell
                            style={{ textAlign: 'center' }}
                        >
                            <TextField
                                key={propertyKey}
                                variant='outlined'
                                label={label}
                                size='small'
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => {
                                    setShownValues(shownValues.map((t, j) => {
                                        if (j === i) {
                                            return { ...t, val: e.target.value };
                                        }
                                        return t;
                                    }));
                                }}
                                value={val + ''}
                            />
                        </TableCell>
                    ))
            }
            <TableCell align="right" padding='none'>
                {!showProperties || allSame ? null :
                    <>
                        <IconButton color='primary' size="small"
                            onClick={() => {
                                const propertiesChanged = changedValues.map(({ key, val }) => { return { key, val } });
                                setEntityProperties(entityItem.key, entityType.key, propertiesChanged);
                            }}
                        >
                            <Check />
                        </IconButton>
                        <IconButton color='secondary' size="small"
                            onClick={() => setShownValues(savedValues)}
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