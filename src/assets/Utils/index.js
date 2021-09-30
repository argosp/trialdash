export const getCurrentEntitsNameByStatus = (trial) => {
  return trial.status == "design" ? "entities" : "deployedEntities";
};

export const getEntitiesByEntitiesTypeKey = (trial, entitiesTypeKey ) => {
  return trial.entities.filter(
    (e) => e.entitiesTypeKey == entitiesTypeKey
  );
};
