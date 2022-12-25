import React, { createContext, useContext } from 'react'

// export const ShapeContext = createContext({kind: 'Point'});
// const { Consumer, Provider } = ShapeContext;

// export const ShapeProvider = Provider;
// export const useShape = () => useContext(ShapeContext);

// import React from 'react'

export const ShapeContext = createContext(null)

export const ShapeProvider = ({ children }) => {
    const [shape, setShape] = React.useState("Point");
    const [rectAngle, setRectAngle] = React.useState(0);
    const [rectRows, setRectRows] = React.useState(3);

    const store = {
        shape, setShape,
        rectAngle, setRectAngle,
        rectRows, setRectRows,
    }

    return <ShapeContext.Provider value={store}>
        {children}
    </ShapeContext.Provider>
}

export const useShape = () => useContext(ShapeContext);
