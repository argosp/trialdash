import React, { createContext, useContext } from 'react';

export const SelectionContext = createContext(null);

export const useSelection = () => useContext(SelectionContext);

export const SelectionProvider = ({ children }) => {
    const [selection, setSelection] = React.useState([]);

    const isSelected = (key) => {
        return StagingEntities.includes(key);
    }

    const toggleIsSelected = (deviceKey) => {
        if (selection.includes(deviceKey)) {
            setSelection(selection.filter(s => s !== deviceKey));
        } else {
            setSelection([...selection, deviceKey]);
        }
    }

    const setAsSelected = (willBeSelected, ...deviceKeys) => {
        const oldWithoutNew = selection.filter(x => !deviceKeys.includes(x));
        if (willBeSelected) {
            setSelection([...oldWithoutNew, ...deviceKeys]);
        } else {
            setSelection(oldWithoutNew);
        }
    }

    const popTopSelection = () => {
        if (selection.length === 0) {
            return undefined;
        }
        const popped = selection[0];
        setSelection(selection.slice(1));
        return popped;
    }

    const store = {
        selection,
        setSelection,
        toggleIsSelected,
        setAsSelected,
        isSelected,
        popTopSelection
    }

    return (
        <SelectionContext.Provider value={store}>
            {children}
        </SelectionContext.Provider>
    )
}
