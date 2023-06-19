import React, { useState } from 'react';
import {
    Grid,
    IconButton,
    Box,
    Paper,
    Button,
    Tooltip,
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
import Control from '../Maps/lib/react-leaflet-custom-control.jsx';
import { EditTable } from './EditTable/EditTable.jsx';
import {
    FREEPOSITIONING_SHAPE,
    POINT_SHAPE
} from './EditTable/utils/constants.js';
import { ReactComponent as PlaylistRemove } from './Icons/PlaylistRemove.svg';
import { ToggleTextOnMap } from '../Maps/ToggleTextOnMap.jsx';
import { NumberTextField } from '../ExperimentContext/ExperimentForm/NumberTextField.jsx';
import { ButtonTooltip } from './ButtonTooltip.jsx';
import { MapCoordinates } from '../Maps/MapCoordinates.jsx';

export const EntityEditor = ({
    experimentDataMaps,
    cloneEntitiesDialog,
}) => {
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
    const [showGrid, setShowGrid] = React.useState({ show: false, meters: 1 });

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

    const onAreaMarked = ({ boxZoomBounds }) => {
        // console.log(boxZoomBounds);  
        const itemsInside = shownEntityItems.filter(({ location, isOnLayer }) => isOnLayer && boxZoomBounds.contains(location));
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
                showGrid={showGrid}
            >
                {
                    shownEntityItems.filter(x => x.isOnLayer).map(({ entityItem, entityType, location }) => (
                        <EntityMarker
                            key={entityItem.key}
                            entityItem={entityItem}
                            entityType={entityType}
                            devLocation={location}
                            isSelected={selection.includes(entityItem.key)}
                            isTypeSelected={shownEntityTypes.includes(entityType.name)}
                            shouldShowName={showName}
                            onClick={() => toggleIsSelected(entityItem.key)}
                        >
                            <ButtonTooltip tooltip="Remove location" onClick={e => setEntityLocations([entityItem.key], layerChosen)}>
                                <LocationOff />
                            </ButtonTooltip>
                            <ButtonTooltip tooltip={selection.includes(entityItem.key) ? "Remove from list" : "Add to list"}
                                onClick={e => toggleIsSelected(entityItem.key)}
                            >
                                {selection.includes(entityItem.key) ? <PlaylistRemove /> : <PlaylistAdd />}
                            </ButtonTooltip>
                        </EntityMarker>
                    ))
                }

                <MarkedShape
                    markedPoints={markedPoints}
                    setMarkedPoints={setMarkedPoints}
                    entityNum={selection.length}
                    distanceInMeters={showDistanceInMeters}
                />

                <Control position="topleft" >
                    <Grid container direction='row'>
                        <Grid item>
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

                <Control prepend={true} position="bottomleft" >
                    <EditTable
                        handleSetOne={handleMapClick}
                        handleSetMany={handlePutEntities}
                        markedPoints={markedPoints}
                        showEditBox={showEditBox}
                        setShowEditBox={setShowEditBox}
                    />
                </Control>

                <Control position="bottomleft">
                    <Grid container spacing={1} direction="column" justifyContent="flex-start" alignItems="flex-start">
                        <Grid item>
                            <Paper>
                                <Button
                                    variant={showName ? 'contained' : 'outlined'}
                                    color={'primary'}
                                    onClick={() => setShowName(!showName)}
                                >
                                    Names
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper>
                                <Button
                                    variant={showEditTable ? 'contained' : 'outlined'}
                                    color={'primary'}
                                    onClick={() => setShowEditTable(!showEditTable)}
                                >Table</Button>
                            </Paper>
                        </Grid>
                        {layerChosen === 'OSMMap'
                            ? null
                            :
                            <Grid item>
                                <Grid container spacing={0}>
                                    <Grid item>
                                        <Paper>
                                            <Button
                                                variant={showGrid.show ? 'contained' : 'outlined'}
                                                color={'primary'}
                                                onClick={() => setShowGrid({ ...showGrid, show: !showGrid.show })}
                                            >
                                                Grid
                                            </Button>
                                        </Paper>
                                    </Grid>
                                    <Grid item>
                                        <Paper>
                                            <NumberTextField
                                                width={'70px'}
                                                label='Meters'
                                                value={showGrid.meters}
                                                onChange={(v) => setShowGrid({ ...showGrid, meters: v })}
                                            />
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                        }
                        <Grid item>
                            <Paper>
                                <Button variant={'contained'} color={'primary'}
                                    onClick={() => cloneEntitiesDialog.ref.current.openDialog()}
                                >
                                    Clone Entities
                                </Button>
                            </Paper>
                            {cloneEntitiesDialog}
                        </Grid>
                        <Grid item>
                            <MapCoordinates showAsLatLong={layerChosen === 'OSMMap'} />
                        </Grid>
                    </Grid>
                </Control>

            </EntityMap>
        </Box>
    )
}