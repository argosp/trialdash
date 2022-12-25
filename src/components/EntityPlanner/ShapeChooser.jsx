import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import React from 'react';
import { InputSlider } from './InputSlider.jsx';
import { useShape } from './ShapeContext.jsx';

export const ShapeChooser = ({ onChange }) => {

    const { shape, setShape, rectAngle, setRectAngle, rectRows, setRectRows, shapeOptions, shapeData } = useShape();

    return (
        <>
            <ToggleButtonGroup
                style={{ margin: 5 }}
                size="small"
                value={shape}
                exclusive
                onChange={(e, newShape) => {
                    setShape(newShape)
                    if (newShape) {
                        onChange(newShape);
                    }
                }}
            >
                {shapeOptions.map(opt =>
                    <ToggleButton value={opt.name} key={opt.name} disabled={opt.disabled}>
                        {opt.name}
                    </ToggleButton>
                )}
            </ToggleButtonGroup>
            {shape !== 'Rect' ? null :
                <InputSlider text='Rect rows' value={rectRows} setValue={setRectRows} />
            }
        </>
    )
}