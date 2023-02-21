import React, { useState } from 'react';
import { TableRow, TableCell } from '@material-ui/core';
import { useEntities } from './EntitiesContext';

export const EntityRow = ({ entityItem, entityType, isSelected, onClick, showProperties, children }) => {
    const { setEntityProperties } = useEntities();

    const savedValues = entityType.properties.filter(({ type }) => type !== 'location')
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
                        >
                            {val}
                        </TableCell>
                    ))
            }
            <TableCell align="right" padding='none'>
                {children}
            </TableCell>
        </TableRow>
    )
}