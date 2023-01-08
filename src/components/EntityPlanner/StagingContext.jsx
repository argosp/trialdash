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

    const store = {
        selection,
        setSelection
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