import { Button, Grid } from '@material-ui/core';
import React from 'react';
import { NumberTextField } from '../ExperimentContext/ExperimentForm/NumberTextField';
import { useEntities } from './EntitiesContext.jsx';
import { EntityList } from './EntityList';
import { EntityMap } from './EntityMap';
import { EntityMarker } from './EntityMarker';
import { MarkedShape } from './MarkedShape';
import { ShapeChooser } from './ShapeChooser';
import { useShape } from './ShapeContext.jsx';
import { SimplifiedSwitch } from './SimplifiedSwitch.jsx';
import { useStaging } from './StagingContext.jsx';
import { TypeChooser } from './TypeChooser';

export const EntityEditor = ({ experimentDataMaps }) => {
    const { shape, shapeData } = useShape();

    const {
        entities,
        setEntityLocations,
        getEntityItemsLocations
    } = useEntities();

    const {
        selection,
        setSelection
    } = useStaging();

    const [selectedType, setSelectedType] = React.useState(entities.length ? entities[0].name : '');
    const [showAll, setShowAll] = React.useState(false);
    const [markedPoints, setMarkedPoints] = React.useState([]);
    const [showName, setShowName] = React.useState(false);
    const [layerChosen, setLayerChosen] = React.useState('OSMMap');
    const [showGrid, setShowGrid] = React.useState(false);
    const [showGridMeters, setShowGridMeters] = React.useState(1);
    const [showOnlyAssigned, setShowOnlyAssigned] = React.useState(false);

    console.log('EntityEditor', layerChosen, entities, showOnlyAssigned, selectedType, showGrid)

    if (selectedType === '' && entities.length > 0) {
        setSelectedType(entities[0].name);
    }

    // TODO: change setEntityLocations to accept selection of device keys instead of type and indices

    const handleMapClick = e => {
        // if (selection.length < 1) return;
        const currPoint = [e.latlng.lat, e.latlng.lng];
        if (shape === 'Point') {
            setEntityLocations(selectedType, selection, layerChosen, [currPoint]);
            setMarkedPoints([]);
            setSelection([]);
        } else {
            setMarkedPoints(markedPoints.concat([currPoint]));
        }
    };

    const handlePutEntities = () => {
        const positions = shapeData.toPositions(markedPoints, selection.length);
        setEntityLocations(selectedType, selection, layerChosen, positions);
        setMarkedPoints([]);
        setSelection([]);
    };

    const experimentMap = (experimentDataMaps || []).find(r => r.imageName === layerChosen);
    const showDistanceInMeters = experimentMap ? !experimentMap.embedded : false;

    const shownEntityItems = getEntityItemsLocations(layerChosen, showAll ? undefined : selectedType);

    return (
        <Grid
            container direction="row-reverse" justifyContent="flex-start" alignItems="stretch"
            style={{ height: '550px' }}
        >
            <Grid item xs={9}>
                <EntityMap
                    onClick={handleMapClick}
                    experimentDataMaps={experimentDataMaps}
                    layerChosen={layerChosen}
                    setLayerChosen={setLayerChosen}
                    showGrid={showGrid}
                    showGridMeters={showGridMeters}
                >
                    {
                        shownEntityItems.map(({ entityItem, entityItemIndex, entityType, location }) => (
                            <EntityMarker
                                key={entityItem.key}
                                entity={entityItem}
                                devLocation={location}
                                isSelected={selection.includes(entityItemIndex)}
                                isTypeSelected={entityType === selectedType}
                                shouldShowName={showName}
                            />
                        ))
                    }

                    <MarkedShape
                        markedPoints={markedPoints}
                        setMarkedPoints={setMarkedPoints}
                        entityNum={selection.length}
                        distanceInMeters={showDistanceInMeters}
                    />

                </EntityMap>
            </Grid>
            <Grid item xs={3} style={{ overflow: 'auto' }}>
                {!entities.length ? null :
                    <>
                        <ShapeChooser
                            onChange={(val) => {
                                if (val === "Point") setMarkedPoints([]);
                            }}
                        />
                        <Button variant="contained" color="primary"
                            disabled={shape === 'Point'}
                            style={{ margin: 5 }}
                            onClick={handlePutEntities}
                        >
                            Put entities
                        </Button>
                        <TypeChooser
                            selectedType={selectedType}
                            onChange={newType => {
                                setSelection([]);
                                setSelectedType(newType);
                            }}
                            showAll={showAll}
                            setShowAll={val => setShowAll(val)}
                            typeOptions={entities.map(dev => { return { name: dev.name } })}
                        />
                        <SimplifiedSwitch
                            label='Entities show name'
                            value={showName}
                            setValue={v => setShowName(v)}
                        />
                        <SimplifiedSwitch
                            label='Show only assigned'
                            value={showOnlyAssigned}
                            setValue={v => setShowOnlyAssigned(v)}
                        />
                        {layerChosen === 'OSMMap' ? null :
                            <div style={{ verticalAlign: 'baseline' }}>
                                <SimplifiedSwitch
                                    label='Show grid'
                                    value={showGrid}
                                    setValue={v => setShowGrid(v)}
                                />
                                <NumberTextField
                                    label='Grid Meters'
                                    value={showGridMeters}
                                    onChange={v => setShowGridMeters(v)}
                                />
                            </div>
                        }
                        <EntityList
                            entities={entities.filter(d => d.name === selectedType)}
                            removeEntitiesLocations={(indices) => setEntityLocations(selectedType, indices, layerChosen)}
                            layerChosen={layerChosen}
                        />
                    </>
                }
            </Grid>
        </Grid>
    )
}