import React from 'react';
import { Button } from '@material-ui/core';
import { INIT_MODE, SELECT_MODE, EDIT_MODE, LOCATIONS_MODE } from './utils/constants';

const TBPButtons = ({ addEntityMode, handleModeChange, setShowName, onSubmit, onCancel }) => {
  const ModeButton = ({ text, mode, variant, color, bottom, onClick }) => {
    return (
      <Button
        variant={variant ? 'contained' : 'outlined'}
        color={color ? 'primary' : 'gray'}
        style={{
          width: '100%',
          marginBottom: bottom ? '10px' : 'none',
        }}
        onClick={() => {
          handleModeChange(mode);
          onClick();
        }}>
        {text}
      </Button>
    );
  };

  if (addEntityMode === EDIT_MODE)
    return (
      <>
        <ModeButton
          variant
          color
          bottom
          mode={LOCATIONS_MODE}
          text="save locations"
          onClick={onSubmit}
        />

        <ModeButton mode={INIT_MODE} text="cancel" onClick={onCancel} />
      </>
    );
  if (addEntityMode === SELECT_MODE)
    return (
      <>
        <ModeButton variant color bottom mode={EDIT_MODE} text="continue" onClick={() => {}} />
        <ModeButton mode={INIT_MODE} text="cancel" onClick={onCancel} />
      </>
    );

  return (
    <>
      <label style={{ cursor: 'pointer' }}>
        <input type="checkbox" onChange={(e) => setShowName(e.target.checked)} />
        Entities show name
      </label>
      <ModeButton variant color mode={SELECT_MODE} text="add entity" onClick={() => {}} />
    </>
  );
};

export default TBPButtons;
