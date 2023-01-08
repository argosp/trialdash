import React, { useEffect } from 'react';
import { EntityTypeRow } from './EntityTypeRow.jsx';

export const TypeChooser = ({ shownEntityTypes, setShownEntityTypes, entities }) => {

    useEffect(() => {
        if (shownEntityTypes.length === 0 && entities.length > 0) {
            setShownEntityTypes([entities[0].name]);
        }
    }, [shownEntityTypes, entities])

    return (
        <div style={{ width: '100%' }}>
            {entities.map(entity => (
                <EntityTypeRow
                    entity={entity}
                    isVisible={shownEntityTypes.includes(entity.name)}
                    setIsVisible={() => setShownEntityTypes([entity.name])}
                ></EntityTypeRow>
            ))}
        </div>
    )
}