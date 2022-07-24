import React from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';

import EntitiesTypesTabs from './EntitiesTypesTabs';
import EntitiesTypesList from './EntitiesTypesList'

import { makeStyles } from '@material-ui/core/styles';
import { styles } from './styles'

const useStyles = makeStyles(styles);

function EntitiesTypesTable({ entities, entitiesTypesInstances,setAddDeviceMode }) {

  const [tabValue, setTabValue] = React.useState(0);

  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container disableGutters fixed>

        <div
          className={classes.subheader}
          component="div"
          id="edit-table-subheader"
          children={
            <>
              <Typography component="span">
                <Box sx={{ fontWeight: '700', padding: 24 }}>
                  Device Types
                </Box>
              </Typography>
              <IconButton color='black' onClick={() => setAddDeviceMode(false)}>
                <CloseIcon />
              </IconButton>
            </>
          }
        />
        <Divider />

        <div
          className={classes.tabs}
          children={<EntitiesTypesTabs tabValue={tabValue} setTabValue={setTabValue} />}
        />

        {
          tabValue === 0 && <EntitiesTypesList entities={entities} entitiesTypesInstances={entitiesTypesInstances} classes={classes} />
        }

      </Container>
    </Box>
  )
}

export default EntitiesTypesTable