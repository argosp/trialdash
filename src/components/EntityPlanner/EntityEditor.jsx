import React, { useState } from 'react';
import {
    Grid,
    IconButton,
    Box,
    Paper,
    Button,
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
import Control from '../Maps/lib/react-leaflet-control.jsx';
import { ShowWorking } from './ShowWorking';
import { EditTable } from './EditTable/EditTable.jsx';
import {
    FREEPOSITIONING_SHAPE,
    POINT_SHAPE
} from './EditTable/utils/constants.js';
import { DomEvent } from 'leaflet';
import { ReactComponent as PlaylistRemove } from './Icons/PlaylistRemove.svg';
import { SingleEntityPropertiesView } from './SingleEntityPropertiesView.jsx';
import { ToggleTextOnMap } from '../Maps/ToggleTextOnMap.jsx';

export const EntityEditor = ({ experimentDataMaps, cloneEntitiesDialog, openCloneEntitiesDialog }) => {
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


    const handleMapClick = e => {
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

    return (
        <Box
            style={{
                height: 'calc(100vh - 180px)',
                // height: '100vh',
                margin: 0,
                left: 0,
                position: 'relative',
                right: 0,
                bottom: 0,
                top: 0
                // top: '150px',
            }}
        >
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

                <ToggleTextOnMap position="bottomleft"
                    name={'Names'}
                    value={showName}
                    setValue={setShowName}
                />

                <ToggleTextOnMap position="bottomleft"
                    name={'Table'}
                    value={showEditTable}
                    setValue={setShowEditTable}
                />

                <MarkedShape
                    markedPoints={markedPoints}
                    setMarkedPoints={setMarkedPoints}
                    entityNum={selection.length}
                    distanceInMeters={showDistanceInMeters}
                />

                <Control position="topleft" >
                    <Grid container direction='row'>
                        <Grid item>
                            <ShowWorking />
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
                        </Grid>
                        <Grid item>
                            <EntityList
                                style={{
                                    overflow: 'auto',
                                    display: 'block'
                                }}
                                entityItems={shownEntityItems.filter(({ entityType }) => entityType.name === showTableOfType)}
                                removeEntitiesLocations={(keys) => setEntityLocations(keys, layerChosen)}
                                layerChosen={layerChosen}
                                showProperties={false}
                            />
                        </Grid>
                    </Grid>
                </Control>

                <Control position="bottomright" >
                    <EntityList
                        style={{
                            overflow: 'auto',
                            display: 'block',
                        }}
                        entityItems={selectedEntityItems}
                        removeEntitiesLocations={(keys) => setEntityLocations(keys, layerChosen)}
                        layerChosen={layerChosen}
                        showProperties={showEditTable}
                    />
                </Control>

                <Control position="topleft" >
                    <EditTable
                        handleSetOne={handleMapClick}
                        handleSetMany={handlePutEntities}
                        markedPoints={markedPoints}
                        showEditBox={showEditBox}
                        setShowEditBox={setShowEditBox}
                    />
                </Control>

                <Control position="bottomleft">
                    <Paper>
                        <Button variant={'contained'} color={'primary'}
                            onClick={() => openCloneEntitiesDialog()}
                        >
                            Clone Entities
                        </Button>
                        {cloneEntitiesDialog}
                    </Paper>
                </Control>

            </EntityMap>
        </Box>
    )
}