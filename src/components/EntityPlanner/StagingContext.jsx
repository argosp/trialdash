import React, { createContext, useContext } from 'react';

export const StagingContext = createContext(null);

export const useStaging = () => useContext(StagingContext);

export const StagingProvider = ({ children }) => {
    const [selection, setSelection] = React.useState([]);

    // const isInStaging = (key) => {
    //     return StagingEntities.includes(key);
    // }

    // const addToStaging = (keys) => {
    //     setStagingEntities([...StagingEntities, ...keys])
    // }

    // const removeFromStaging = (keys) => {
    //     setStagingEntities(StagingEntities.filter(k => keys.includes(k)));
    // }

    // const clearStaging = () => {
    //     setStagingEntities([]);
    // }

    const toggleIsSelected = (deviceKey) => {
        if (selection.includes(deviceKey)) {
            setSelection(selection.filter(s => s !== deviceKey));
        } else {
            setSelection([...selection, deviceKey]);
        }
    }

    const store = {
        selection,
        setSelection,
        toggleIsSelected
    //     StagingEntities,
    //     isInStaging,
    //     addToStaging,
    //     removeFromStaging,
    //     clearStaging
    }

    return (
        <StagingContext.Provider value={store}>
            {children}
        </StagingContext.Provider>
    )
}
