import React from "react";
import { TextField } from "@material-ui/core";
import { DebounceInput } from "react-debounce-input";

export const NumberTextField = ({ value, onChange, label, width }) => {
  return (
    <DebounceInput
      value={value}
      onChange={(e) => {
        const num = parseFloat(e.target.value);
        if (Number.isFinite(num)) {
          onChange(parseFloat(e.target.value));
        }
      }}
      style={{ width: width ? width : "120px" }}
      variant="outlined"
      label={label}
      minLength={1}
      debounceTimeout={500}
      element={TextField}
      size="small"
    />
  );
};
