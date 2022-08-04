import React from 'react';
import { Typography, Box, Container } from '@material-ui/core'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { CheckOutlined } from "@material-ui/icons";


const ListIcon = () => (
  <ListItemIcon>
    <CheckOutlined />
  </ListItemIcon>
)

const MapTypesList = ({ layerChosen, handleMapTypeChange }) => {

  return (
    <Container disableGutters fixed className="tbpRow">
      <Typography component="span">
        <Box sx={{ fontWeight: 600 }}>Maps</Box>
      </Typography>
      <List
        sx={{ width: '100%', maxWidth: 360, backgroundColor: 'white', cursor: 'pointer' }}
        aria-label="contacts"
      >
        {
          ['OSMMap', 'Concourse', 'Platform']
            .map((type) => {
              const isMapType = type === layerChosen
              return (
                <ListItem disablePadding onClick={() => handleMapTypeChange(type)}>
                  {isMapType && <ListIcon />}
                  <ListItemText fontSize="1rem" inset={!isMapType} primary={type} />
                </ListItem>
              )
            })
        }
      </List>
    </Container>
  );
}
export default MapTypesList