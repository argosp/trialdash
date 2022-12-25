import React, { useState } from "react";
import CustomTooltip from "../../../../CustomTooltip";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import NestedAccordion from "../../../../NestedAccordion";

const ContainsEntitiesDisplayList = ({
  entity,
  experimentEntitiesArray,
  trialEntitiesArray,
  removeEntityFromParent,
  classes,
}) => {
  const [openContent, setOpenContent] = useState(false);
  const [updatedTrialEntities, setUpdatedTrialEntities] = useState({}); //with subItems

  const getParentEntity = () => {
    return { ...trialEntitiesArray[getEntityIndex(entity.key)] };
  };

  const getSubItems = () => {
    let item = getParentEntity();
    createSubItems(item);
    updateEntities(item);
  };

  const updateEntities = (item) => {
    setUpdatedTrialEntities((prevTrialEntities) => ({
      ...prevTrialEntities,
      [item.key]: item,
    }));
  };

  const findEntityName = (entity) => {
    return experimentEntitiesArray[entity.key][0].name;
  };
  const getEntityIndex = (entityKey) => {
    return trialEntitiesArray.findIndex((el) => el.key === entityKey);
  };
  const createSubItems = (parentEntity) => {
    if (parentEntity.containsEntities && parentEntity.containsEntities.length) {
      parentEntity.subItems = [];
      parentEntity.name = findEntityName(parentEntity);
      parentEntity.containsEntities.forEach((entityKey) => {
        let foundEntity = trialEntitiesArray[getEntityIndex(entityKey)];
        if (foundEntity) {
          let index = parentEntity.subItems.indexOf(foundEntity.key);
          if (index < 0) {
            foundEntity.name = findEntityName(foundEntity);
            parentEntity.subItems.push(foundEntity);
          }
          return createSubItems(foundEntity);
        }
      });
    }
  };

  const removeEntity = (subEntityKey) => {
    //mutaion
    //TODO: try catch
    //TODO: check parent key forward to server
    removeEntityFromParent(entity.key, { key: subEntityKey }, "delete");
    removeEntityFromArray(subEntityKey);
  };
  const removeEntityFromArray = (subEntityKey) => {
    const res = findAndUpdateNestedItem(
      [...updatedTrialEntities[entity.key].subItems],
      subEntityKey,
      "subItems"
    );
    setUpdatedTrialEntities((prevTrialEntities) => ({
      ...prevTrialEntities,
      [entity.key]: { ...prevTrialEntities[entity.key], subItems: res },
    }));
  };

  const findAndUpdateNestedItem = (arr, key, nestingKey) => {
    for (let index = 0; index < arr.length; index++) {
      let item = arr[index];
      if (item.key === key) {
        item.deleted = true;
        return arr;
      }
      if (item[nestingKey])
        return findAndUpdateNestedItem(item[nestingKey], key, nestingKey);
    }
  };
  const checkHasSubItem = () => {
    return (
      !!updatedTrialEntities[entity.key] &&
      !!updatedTrialEntities[entity.key].subItems &&
      !updatedTrialEntities[entity.key].subItems.length
    );
  };
  const handleClick = () => {
    if (!openContent && !checkHasSubItem()) getSubItems();
    setOpenContent(!openContent);
  };
  return (
    <>
      <CustomTooltip
        onClick={handleClick}
        title="Open"
        className={openContent ? classes.arrowDown : ""}
        ariaLabel="open"
      >
        <ArrowForwardIosIcon />
      </CustomTooltip>
      {openContent && (
        <NestedAccordion
          data={updatedTrialEntities[entity.key]}
          removeEntity={removeEntity}
        ></NestedAccordion>
      )}
    </>
  );
};
export default ContainsEntitiesDisplayList;
