import React from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';

import EditTableTabs from './EditTableTabs';
import EditTableList from './EditTableList'

import { makeStyles } from '@material-ui/core/styles';
import { styles } from './styles'

const useStyles = makeStyles(styles);

function EditTable({ entities, setAddDeviceMode }) {

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
          children={<EditTableTabs tabValue={tabValue} setTabValue={setTabValue} />}
        />

        {
          tabValue === 0 && <EditTableList entities={entities} classes={classes} />
        }

      </Container>
    </Box>
  )
}

export default EditTable