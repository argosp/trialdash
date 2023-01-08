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
                    setIsVisible={(toshow) => {
                        if (toshow) {
                            setShownEntityTypes([...shownEntityTypes, entity.name]);
                        } else {
                            setShownEntityTypes(shownEntityTypes.filter(e => e !== entity.name));
                        }
                    }}
                ></EntityTypeRow>
            ))}
        </div>
    )
}