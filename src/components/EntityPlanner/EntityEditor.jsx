import React from 'react';
import { Button, Grid, Paper } from '@material-ui/core';
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
import { WidthDivider } from './WidthDivider.jsx';
import Control from './lib/react-leaflet-control.jsx'

export const EntityEditor = ({ experimentDataMaps }) => {
    const { shape, shapeData } = useShape();

    const {
        entities,
        setEntityLocations,
        getEntityItems
    } = useEntities();

    const {
        selection,
        setSelection
    } = useStaging();

    const [shownEntityTypes, setShownEntityTypes] = React.useState([]);
    const [markedPoints, setMarkedPoints] = React.useState([]);
    const [showName, setShowName] = React.useState(false);
    const [layerChosen, setLayerChosen] = React.useState('OSMMap');

    console.log('EntityEditor', layerChosen, entities, shownEntityTypes)

    const handleMapClick = e => {
        // if (selection.length < 1) return;
        const currPoint = [e.latlng.lat, e.latlng.lng];
        if (shape === 'Point') {
            setEntityLocations(selection, layerChosen, [currPoint]);
            setMarkedPoints([]);
            setSelection([]);
        } else if (shape === 'Pop') {
            if (selection.length > 0) {
                setEntityLocations(selection.slice(0, 1), layerChosen, [currPoint]);
                setSelection(selection.slice(1));
            }
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

    const shownEntityItems = getEntityItems(shownEntityTypes, layerChosen);
    const selectedEntityItems = selection.map(s => shownEntityItems.find(({ entityItem }) => entityItem.key === s)).filter(x => x);

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
                >
                    {
                        shownEntityItems.filter(x => x.isOnLayer).map(({ entityItem, entityType, location }) => (
                            <EntityMarker
                                key={entityItem.key}
                                entity={entityItem}
                                devLocation={location}
                                isSelected={selection.includes(entityItem.key)}
                                isTypeSelected={shownEntityTypes.includes(entityType.name)}
                                shouldShowName={showName}
                            />
                        ))
                    }
                    <Control position="bottomright" >
                        <Paper>
                            <SimplifiedSwitch
                                label='Show name'
                                value={showName}
                                setValue={v => setShowName(v)}
                            />
                        </Paper>
                    </Control>

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
                                if (shape === 'Point' || shape === 'Pop') setMarkedPoints([]);
                            }}
                        />
                        <Button variant="contained" color="primary"
                            disabled={shape === 'Point' || shape === 'Pop'}
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
                        <div style={{ maxHeight: 200, overflow: 'auto' }}>
                            <EntityList
                                style={{ overflow: 'auto', height: '250px', display: 'block' }}
                                entityItems={shownEntityItems}
                                removeEntitiesLocations={(keys) => setEntityLocations(keys, layerChosen)}
                                layerChosen={layerChosen}
                            />
                        </div>
                        <WidthDivider />
                        <div style={{ maxHeight: 200, overflow: 'auto' }}>
                            <EntityList
                                style={{ overflow: 'auto', height: '250px', display: 'block' }}
                                entityItems={selectedEntityItems}
                                removeEntitiesLocations={(keys) => setEntityLocations(keys, layerChosen)}
                                layerChosen={layerChosen}
                            />
                        </div>
                    </>
                }
            </Grid>
        </Grid>
    )
}