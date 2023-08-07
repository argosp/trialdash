import React, { createContext, useContext } from 'react';

export const PopupSwitchContext = createContext(null);

export const usePopupSwitch = () => useContext(PopupSwitchContext);

export const PopupSwitchProvider = ({ children }) => {
    const [popupSwitch, setPopupSwitch] = React.useState();

    const switchToPopup = (key) => {
        setPopupSwitch(key);
    }

    const isPopupSwitchedTo = (key) => {
        if (popupSwitch === key) {
            setPopupSwitch(undefined);
            return true;
        }
        return false;
    }

    return (
        <PopupSwitchContext.Provider value={{
            switchToPopup,
            isPopupSwitchedTo
        }}>
            {children}
        </PopupSwitchContext.Provider>
    )
}
