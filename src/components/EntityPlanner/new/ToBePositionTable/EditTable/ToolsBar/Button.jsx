import { Button as MuiButton } from '@material-ui/core';
import React from 'react';

export const Button = ({ text, ...rest }) => {
  return (
    <div style={{ width: '100%', boxShadow: '0px -2px 20px rgba(105, 97, 97, 0.08)' }}>
      <MuiButton
        variant="outlined"
        color="primary"
        style={{ width: '95%', margin: '10px auto' }}
        {...rest}>
        {text}
      </MuiButton>
    </div>
  );
};
