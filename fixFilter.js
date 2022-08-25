68
const [isFiltered, setIsFiltered] = React.useState(false);


89
if (filtered.length) {
    setIsFiltered(true);
  } else {
    setIsFiltered(false);
  }

482
  <EntityTypeFilter
  classes={classes}
  handleFilterDevices={handleFilterDevices}
  entitiesNames={entitiesTypes.map((device) => device.name)}
  filteredEntities={filteredEntities}
  isFiltered={isFiltered}
/>
