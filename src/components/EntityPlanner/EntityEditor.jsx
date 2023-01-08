import { Button, Grid } from '@material-ui/core';
import React, { useEffect } from 'react';
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

    const [shownEntityTypes, setShownEntityTypes] = React.useState(entities.length ? [entities[0].name] : []);
    const [markedPoints, setMarkedPoints] = React.useState([]);
    const [showName, setShowName] = React.useState(false);
    const [layerChosen, setLayerChosen] = React.useState('OSMMap');
    const [showGrid, setShowGrid] = React.useState(false);
    const [showGridMeters, setShowGridMeters] = React.useState(1);
    const [showOnlyAssigned, setShowOnlyAssigned] = React.useState(false);

    console.log('EntityEditor', layerChosen, entities, showOnlyAssigned, shownEntityTypes, showGrid)

    // TODO:
    // 1. change selection to staging stack
    // 2. Show all entities from all types
    // 3. let some type be hidden

    const handleMapClick = e => {
        // if (selection.length < 1) return;
        const currPoint = [e.latlng.lat, e.latlng.lng];
        if (shape === 'Point') {
            setEntityLocations(selection, layerChosen, [currPoint]);
            setMarkedPoints([]);
            setSelection([]);
        } else {
            setMarkedPoints(markedPoints.concat([currPoint]));
        }
    };

    const handlePutEntities = () => {
        const positions = shapeData.toPositions(markedPoints, selection.length);
        setEntityLocations(selection, layerChosen, positions);
        setMarkedPoints([]);
        setSelection([]);
    };

    const experimentMap = (experimentDataMaps || []).find(r => r.imageName === layerChosen);
    const showDistanceInMeters = experimentMap ? !experimentMap.embedded : false;

    const shownEntityItems = getEntityItemsLocations(layerChosen, shownEntityTypes);

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
                                isTypeSelected={shownEntityTypes.includes(entityType)}
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
                            shownEntityTypes={shownEntityTypes}
                            setShownEntityTypes={newTypes => {
                                setSelection([]);
                                setShownEntityTypes(newTypes);
                            }}
                            entities={entities}
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
                            entityItems={entities.filter(d => shownEntityTypes.includes(d.name)).flatMap(entity => entity.items.map(item => { return { entity, item }; }))}
                            removeEntitiesLocations={(keys) => setEntityLocations(keys, layerChosen)}
                            layerChosen={layerChosen}
                        />
                        <SimplifiedSwitch
                            label='Show name'
                            value={showName}
                            setValue={v => setShowName(v)}
                        />
                        <SimplifiedSwitch
                            label='Show only assigned'
                            value={showOnlyAssigned}
                            setValue={v => setShowOnlyAssigned(v)}
                        />
                    </>
                }
            </Grid>
        </Grid>
    )
}