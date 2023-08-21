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
import { useSelection } from './SelectionContext.jsx';
import { TypeChooser } from './TypeChooser';
import Control from '../Maps/lib/react-leaflet-custom-control.jsx';
import { EditToolBox } from './EditToolBox/EditToolBox.jsx';
import {
    FREEPOSITIONING_SHAPE,
    CHOOSE_SHAPE,
    POINT_SHAPE
} from './EditToolBox/utils/constants.js';
import { ReactComponent as PlaylistRemove } from './Icons/PlaylistRemove.svg';
import { ToggleTextOnMap } from '../Maps/ToggleTextOnMap.jsx';
import { NumberTextField } from '../ExperimentContext/ExperimentForm/NumberTextField.jsx';
import { ButtonTooltip } from './ButtonTooltip.jsx';
import { MapCoordinates } from '../Maps/MapCoordinates.jsx';
import { MapRightClicker } from './MapRightClicker.jsx';
import { EntityMarkersShown } from './EntityMarkersShown.jsx';
import { UploadEntitiesDialog } from './UploadEntitiesDialog.jsx';
import { CloneIcon } from '../../constants/icons.jsx';

export const EntityEditor = ({
    experimentDataMaps,
    cloneEntitiesDialog,
    client,
    match,
    trial,
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
        toggleIsSelected,
        popTopSelection
    } = useSelection();

    const [shownEntityTypes, setShownEntityTypes] = useState([]);
    const [markedPoints, setMarkedPoints] = useState([]);
    const [showName, setShowName] = useState(false);
    const [layerChosen, setLayerChosen] = useState('OSMMap');
    const [showTableOfType, setShowTableOfType] = useState('');
    const [showEditBox, setShowEditBox] = useState(false);
    const [showEditTable, setShowEditTable] = useState(false);
    const [showGrid, setShowGrid] = React.useState({ show: false, meters: 1 });

    const positionTopOfStack = (currPoint, selection) => {
        if (selection.length > 0) {
            setEntityLocations([popTopSelection()], layerChosen, [currPoint]);
            setShowEditBox(false);
        }
    }
    const handleMapClick = e => {
        const currPoint = [e.latlng.lat, e.latlng.lng];
        if (!shapeData.noControlPoints) {
            if (!shapeData.maxPoints) {
                setMarkedPoints(markedPoints.concat([currPoint]));
            } else {
                setMarkedPoints(markedPoints.slice(0, shapeData.maxPoints - 1).concat([currPoint]));
            }
        } else if (shape === POINT_SHAPE) {
            setEntityLocations(selection, layerChosen, [currPoint]);
            setMarkedPoints([]);
            setSelection([]);
            setShowEditBox(false);
        } else if (shape === FREEPOSITIONING_SHAPE) {
            positionTopOfStack(currPoint, selection)
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
                <MapRightClicker selection={selection} positionTopOfStack={positionTopOfStack} />

                <EntityMarkersShown
                    shownEntityItems={shownEntityItems}
                    shownEntityTypes={shownEntityTypes}
                    shouldShowName={showName}
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
                    <EditToolBox
                        handleSetOne={handleMapClick}
                        handleSetMany={handlePutEntities}
                        markedPoints={markedPoints}
                        setMarkedPoints={setMarkedPoints}
                        showEditBox={showEditBox}
                        setShowEditBox={setShowEditBox}
                    >
                        <UploadEntitiesDialog
                            client={client}
                            match={match}
                            trial={trial}
                            entities={entities}
                        />
                        <Tooltip title='Clone Entities' placement="right">
                            <IconButton onClick={() => cloneEntitiesDialog.ref.current.openDialog()}>
                                <CloneIcon />
                            </IconButton>
                        </Tooltip>
                        {cloneEntitiesDialog}
                    </EditToolBox>
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
                            <MapCoordinates showAsLatLong={layerChosen === 'OSMMap'} />
                        </Grid>
                    </Grid>
                </Control>

            </EntityMap>
        </Box>
    )
}