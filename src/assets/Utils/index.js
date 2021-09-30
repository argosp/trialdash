export const getCurrentEntitsNameByStatus = (trial) => {
  return trial.status == "design" ? "entities" : "deployedEntities";
};

export const getEntitiesByEntitiesTypeKey = (trial, entitiesTypeKey) => {
  return trial.entities.filter((e) => e.entitiesTypeKey == entitiesTypeKey);
};

export const getEntitiesTypeArrayFromSelectedTrial = (trial, entitiesTypes) => {
  const entitiesTypeKeyArr = trial.entities.map((obj) => {
    return obj.entitiesTypeKey;
  });

  return Object.entries(entitiesTypes)
    .filter((e) => entitiesTypeKeyArr.indexOf(e[0]) != -1)
    .map((item) => item[1][0]);
};
