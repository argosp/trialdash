import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ImageAspectRatioOutlinedIcon from '@material-ui/icons/ImageAspectRatioOutlined';
import Grid from '@material-ui/core/Grid';
import classnames from 'classnames';
import { styles } from './styles';
import RightPanelContainer from '../../RightPanelContainer';
import CustomInput from '../../CustomInput';
import SwitchSection from './SwitchSection';
import SimpleButton from '../../SimpleButton';

const DeviceFormPanel = ({ classes }) => (
  <RightPanelContainer
    title={(
      <span className={classes.header}>
        {<ImageAspectRatioOutlinedIcon className={classes.headerIcon} />}
        Device SKU
      </span>
)}
  >
    <div className={classes.content}>
      <CustomInput
        id="device-sku-label"
        label="Label"
        placeholder="Device SKU"
        bottomDescription="a short description about the device name"
        className={classes.input}
      />
      <CustomInput
        id="device-sku-description"
        label="Description"
        placeholder="a short description about the device name"
        bottomDescription="a short description about the device name"
        className={classes.input}
      />
      <CustomInput
        id="device-sku-id"
        label="ID"
        bottomDescription="a short description about the device name"
        className={classes.input}
      />
      <Grid container spacing={3}>
        <Grid item xs>
          <CustomInput
            id="device-sku-prefix"
            label="Prefix"
            bottomDescription="a short description about the device name"
            className={classes.input}
          />
        </Grid>
        <Grid item xs>
          <CustomInput
            id="device-sku-sufix"
            label="Sufix"
            bottomDescription="a short description about the device name"
            className={classes.input}
          />
        </Grid>
      </Grid>
      <SwitchSection
        className={classes.requiredSwitch}
        title="Required"
        description="a short description about the device name"
      />
      <CustomInput
        id="device-sku-template"
        className={classnames(classes.input, classes.templateInput)}
        bottomDescription={(
          <>
            set template using inside {'{}'}
            <br />
            [N] - number counter
            <br />
            [A] - letter counter
            <br />
            {'{device[N]}'} : device1, device2, device3...
          </>
        )}
      />
      <SwitchSection
        title="Multiple values"
        description="a short description about the device name"
      />
      <SwitchSection
        title="Trial field"
        description="this field is set per trial"
      />
      <Grid container wrap="nowrap" spacing={2} className={classes.buttonsWrapper}>
        <Grid item xs>
          <SimpleButton
            className={classes.button}
            colorVariant="primary"
            // onClick={}
            text="Save"
          />
        </Grid>
        <Grid item xs>
          <SimpleButton
            variant="outlined"
            className={classnames(classes.button, classes.cancelButton)}
            // onClick={}
            text="Cancel"
          />
        </Grid>
      </Grid>
    </div>
  </RightPanelContainer>
);

export default withStyles(styles)(DeviceFormPanel);
