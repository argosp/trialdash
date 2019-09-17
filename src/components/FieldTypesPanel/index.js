import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { styles } from './styles';
import RightPanelContainer from '../RightPanelContainer';
import { FIELD_TYPES } from '../../constants/attributes';

class FieldTypesPanel extends React.Component {
  generateFieldTypesArray = () => {
    const fieldTypesArray = [];

    Object.keys(FIELD_TYPES).forEach((fieldType) => {
      fieldTypesArray.push(FIELD_TYPES[fieldType]);
    });

    return fieldTypesArray;
  };

  render() {
    const { classes } = this.props;

    return (
      <RightPanelContainer title="Field Types">
        {this.generateFieldTypesArray().map(fieldType => (
          <Grid
            container
            alignItems="center"
            className={classes.fieldTypeWrapper}
          >
            {fieldType.iconComponent}
            <span className={classes.fieldTypeTitle}>{fieldType.title}</span>
          </Grid>
        ))}
      </RightPanelContainer>
    );
  }
}

export default withStyles(styles)(FieldTypesPanel);
