import React, { useCallback, useEffect, useState } from 'react';

export const useEntityTypeVisible = ({ entities }) => {
  // selectedType is an object of true values for each key, each key is string of selected entity type
  const [selectedType, setSelectedType] = useState({});

  const setAllTypesVisible = useCallback(() => {
    setSelectedType(
      entities.reduce((prev, entityType) => ({ ...prev, [entityType.name]: true }), {})
    );
  }, [entities]);

  useEffect(() => {
    setAllTypesVisible();
  }, [entities]);

  const toggleTypeVisible = (entityTypeName) => {
    setSelectedType((prev) => ({
      ...prev,
      [entityTypeName]: !selectedType[entityTypeName],
    }));
  };

  const isTypeVisible = (entityTypeName) => {
    return selectedType[entityTypeName];
  };

  return { isTypeVisible, toggleTypeVisible, setAllTypesVisible };
};
