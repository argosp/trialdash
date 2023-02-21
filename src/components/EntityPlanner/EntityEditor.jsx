import React, { useState } from 'react';
import {
    Grid,
    Paper,
    Button,
    IconButton,
} from '@material-ui/core';
import {
    LocationOff,
    PlaylistAdd
} from "@material-ui/icons";
import { useEntities } from './EntitiesContext.jsx';
import { EntityList } from './EntityList';
import { EntityMap } from './EntityMap';
import { EntityMarker } from './EntityMarker';
import { MarkedShape } from './MarkedShape';
import { useShape } from './ShapeContext.jsx';
import { useStaging } from './StagingContext.jsx';
import { TypeChooser } from './TypeChooser';
import Control from './lib/react-leaflet-control.jsx';
import { ShowWorking } from './ShowWorking';
import { EditTable } from './EditTable/EditTable.jsx';
import {
    FREEPOSITIONING_SHAPE,
    POINT_SHAPE
} from './EditTable/utils/constants.js';
import { DomEvent } from 'leaflet';
import { ReactComponent as PlaylistRemove } from './Icons/PlaylistRemove.svg';
import { SingleEntityPropertiesView } from './SingleEntityPropertiesView.jsx';

export const EntityEditor = ({ experimentDataMaps }) => {
    const { shape, shapeData } = useShape();

    const {
        entities,
        setEntityLocations,
        getEntityItems
    } = useEntities();

    const {
        selection,
        setSelection,
        toggleIsSelected
    } = useStaging();

    const [shownEntityTypes, setShownEntityTypes] = useState([]);
    const [markedPoints, setMarkedPoints] = useState([]);
    const [showName, setShowName] = useState(false);
    const [layerChosen, setLayerChosen] = useState('OSMMap');
    const [showTableOfType, setShowTableOfType] = useState('');
    const [showEditBox, setShowEditBox] = useState(false);
    const [showEditTable, setShowEditTable] = useState(false);

    // console.log('EntityEditor', layerChosen, entities, shownEntityTypes)

    const handleMapClick = e => {
        // if (selection.length < 1) return;
        const currPoint = [e.latlng.lat, e.latlng.lng];
        if (shape === POINT_SHAPE) {
            setEntityLocations(selection, layerChosen, [currPoint]);
            setMarkedPoints([]);
            setSelection([]);
            setShowEditBox(false);
        } else if (shape === FREEPOSITIONING_SHAPE) {
            if (selection.length > 0) {
                setEntityLocations(selection.slice(0, 1), layerChosen, [currPoint]);
                setSelection(selection.slice(1));
                setShowEditBox(false);
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
        setShowEditBox(false);
    };

    const onAreaMarked = ({ bounds }) => {
        console.log(bounds);
        const itemsInside = shownEntityItems.filter(({ location, isOnLayer }) => isOnLayer && bounds.contains(location));
        const keysInside = itemsInside.map(({ entityItem }) => entityItem.key);
        const newKeysInside = keysInside.filter(k => !selection.includes(k));
        setSelection([...selection, ...newKeysInside]);
    }

    const experimentMap = (experimentDataMaps || []).find(r => r.imageName === layerChosen);
    const showDistanceInMeters = experimentMap ? !experimentMap.embedded : false;

    const shownEntityItems = getEntityItems(shownEntityTypes, layerChosen);
    const selectedEntityItems = selection.map(s => shownEntityItems.find(({ entityItem }) => entityItem.key === s)).filter(x => x);
    const showTable = showTableOfType !== '';

    return (
        <Grid
            container direction="row" justifyContent="flex-start" alignItems="stretch"
            style={{ height: '550px' }}
        >
            <Grid item
                xs={3}
                style={{ height: '550px', overflow: 'auto' }}>
                <>
                    <ShowWorking />
                    {!entities.length ? null :
                        <>
                            <TypeChooser
                                shownEntityTypes={shownEntityTypes}
                                setShownEntityTypes={newTypes => {
                                    setSelection([]);
                                    setShownEntityTypes(newTypes);
                                }}
                                entities={entities}
                                entityItems={shownEntityItems}
                                showTableOfType={showTableOfType}
                                setShowTableOfType={setShowTableOfType}
                                onClickType={(t) => setShowTableOfType(t === showTableOfType ? '' : t)}
                            />
                            <div
                                style={{
                                    marginTop: '10px'
                                }}
                            >
                                <EntityList
                                    style={{
                                        overflow: 'auto',
                                        //  height: '250px',
                                        display: 'block',

                                    }}
                                    entityItems={selectedEntityItems}
                                    removeEntitiesLocations={(keys) => setEntityLocations(keys, layerChosen)}
                                    layerChosen={layerChosen}
                                    showProperties={showEditTable}
                                />
                            </div>
                        </>
                    }
                </>
            </Grid>
            {showTable // && !showEditTable
                ? <Grid item xs={3}
                    style={{ height: '550px', overflow: 'auto' }}
                >
                    <EntityList
                        style={{ overflow: 'auto', height: '250px', display: 'block' }}
                        entityItems={shownEntityItems.filter(({ entityType }) => entityType.name === showTableOfType)}
                        removeEntitiesLocations={(keys) => setEntityLocations(keys, layerChosen)}
                        layerChosen={layerChosen}
                        showProperties={false}
                    />
                </Grid>
                : null
            }
            <Grid item>
                <EditTable
                    handleSetOne={handleMapClick}
                    handleSetMany={handlePutEntities}
                    markedPoints={markedPoints}
                    showEditBox={showEditBox}
                    setShowEditBox={setShowEditBox}
                    showEditTable={showEditTable}
                    setShowEditTable={setShowEditTable}
                />
            </Grid>
            <Grid item xs={showTable ? 5 : 8}>
                <EntityMap
                    onClick={handleMapClick}
                    experimentDataMaps={experimentDataMaps}
                    layerChosen={layerChosen}
                    setLayerChosen={setLayerChosen}
                    onAreaMarked={onAreaMarked}
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
                                onClick={() => toggleIsSelected(entityItem.key)}
                            >
                                <IconButton onClick={(e) => {
                                    DomEvent.stop(e);
                                    setEntityLocations([entityItem.key], layerChosen)
                                }}>
                                    <LocationOff />
                                </IconButton>
                                <IconButton onClick={(e) => {
                                    DomEvent.stop(e);
                                    toggleIsSelected(entityItem.key)
                                }}>
                                    {selection.includes(entityItem.key) ? <PlaylistRemove /> : <PlaylistAdd />}
                                </IconButton>
                                <SingleEntityPropertiesView
                                    entityItem={entityItem}
                                    entityType={entityType}
                                ></SingleEntityPropertiesView>
                            </EntityMarker>
                        ))
                    }
                    <Control position="bottomright" >
                        <Paper>
                            <Button
                                variant={showName ? 'contained' : 'outlined'}
                                color={'primary'}
                                onClick={() => {
                                    setShowName(!showName);
                                }}
                            >
                                Names
                            </Button>
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
        </Grid>
    )
}