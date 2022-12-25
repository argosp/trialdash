import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import React from "react";

export const ShapeChooser = ({ shape, onChange, shapeOptions }) => (
  <ToggleButtonGroup
    style={{ margin: 5 }}
    size="small"
    value={shape}
    exclusive
    onChange={(e, newShape) => {
      if (newShape) {
        onChange(newShape);
      }
    }}
  >
    {shapeOptions.map((opt) => (
      <ToggleButton value={opt.name} key={opt.name} disabled={opt.disabled}>
        {opt.name}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
);
