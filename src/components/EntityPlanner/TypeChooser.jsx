import React from 'react';
import { EntityTypeRow } from './EntityTypeRow.jsx';

export const TypeChooser = ({ selectedType, onChange, entities }) => (
    <div style={{ width: '100%' }}>
        {entities.map(entity => (
            <EntityTypeRow
                entity={entity}
                isVisible={selectedType.includes(entity.name)}
                setIsVisible={ () => onChange([entity.name])}
            ></EntityTypeRow>
        ))}
    </div>
)