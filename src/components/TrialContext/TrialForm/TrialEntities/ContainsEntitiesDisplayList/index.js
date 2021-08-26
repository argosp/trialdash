import React, { useEffect, useState } from "react";
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
  const [data, setData] = useState({});

  useEffect(() => {
    for (const element of trialEntitiesArray) {
      createSubItems(element);
    }
  }, []);
  const handleClick = () => {
    setData(trialEntitiesArray.find((el) => el.key === entity.key));
    setOpenContent(!openContent);
  };

  const findEntityName = (entity) => {
    return experimentEntitiesArray[entity.key][0].name;
  };
  const findEntity = (entityKey) => {
    return trialEntitiesArray.find((el) => el.key === entityKey);
  };
  const createSubItems = (parentEntity) => {
    if (parentEntity.containsEntities && parentEntity.containsEntities.length) {
      parentEntity.subItems = [];
      parentEntity.name = findEntityName(parentEntity);
      parentEntity.containsEntities.forEach((entityKey) => {
        let foundEntity = findEntity(entityKey);
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

  const removeEntity = (entityKey) => {
    removeEntityFromParent(data.key,{key: entityKey}, 'delete');
  };
  return (
    <div>
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
          data={data}
          removeEntity={removeEntity}
        ></NestedAccordion>
      )}
    </div>
  );
};
export default ContainsEntitiesDisplayList;
