import React, { useState } from 'react';
import {
    Grid,
    IconButton,
    Box, Button,
    Tooltip
} from '@mui/material';
import { useEntities } from './EntitiesContext.jsx';
import { EntityList } from './EntityList';
import { EntityMap } from './EntityMap';
import { MarkedShape } from './MarkedShape';
import { useShape } from './ShapeContext.jsx';
import { useSelection } from './SelectionContext.jsx';
import { TypeChooser } from './TypeChooser';
import Control from '../Maps/lib/react-leaflet-custom-control.jsx';
import { EditToolBox } from './EditToolBox/EditToolBox.jsx';
import {
    FREEPOSITIONING_SHAPE, POINT_SHAPE
} from './EditToolBox/utils/constants.js';
import { NumberTextField } from '../ExperimentContext/ExperimentForm/NumberTextField.jsx';
import { MapCoordinates } from '../Maps/MapCoordinates.jsx';
import { MapRightClicker } from './MapRightClicker.jsx';
import { EntityMarkersShown } from './EntityMarkersShown.jsx';
import { UploadEntitiesDialog } from './UploadEntitiesDialog.jsx';
import { CloneIcon, GridIcon } from '../../constants/icons.jsx';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import { RefocusShownEntities } from './RefocusShownEntities.jsx';
import { TypesInfoBox } from './TypesInfoBox.jsx';

export const EntityEditor = ({
    experimentDataMaps,
    cloneEntitiesDialog,
    client,
    match,
    trial,
    history,
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
                height: 'calc(100vh - 108px)',
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

                <RefocusShownEntities
                    shownEntityItems={shownEntityItems}
                />

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
                    <TypesInfoBox
                        shownEntityItems={shownEntityItems}
                        shownEntityTypes={shownEntityTypes}
                        setShownEntityTypes={newTypes => {
                            setSelection([]);
                            setShownEntityTypes(newTypes);
                        }}
                        showTableOfType={showTableOfType}
                        setShowTableOfType={setShowTableOfType}
                        entities={entities}
                        layerChosen={layerChosen}
                        history={history}
                        match={match}
                    >
                    </TypesInfoBox>
                </Control>

                <Control position="topright" >
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
                        <Tooltip title='Show Entities Names' placement="top">
                            <IconButton
                                color={showName ? 'primary' : ''}
                                onClick={() => setShowName(!showName)}
                            >
                                <TextFormatIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Show Edit Table' placement="top">
                            <IconButton
                                color={showEditTable ? 'primary' : ''}
                                onClick={() => setShowEditTable(!showEditTable)}
                            >
                                <GridIcon />
                            </IconButton>
                        </Tooltip>
                        <UploadEntitiesDialog
                            client={client}
                            match={match}
                            trial={trial}
                            entities={entities}
                        />
                        <Tooltip title='Clone Entities' placement="top">
                            <IconButton onClick={() => cloneEntitiesDialog.ref.current.openDialog()}>
                                <CloneIcon />
                            </IconButton>
                        </Tooltip>
                        {cloneEntitiesDialog}
                        {/* </Control> */}

                        {layerChosen === 'OSMMap' ? null :
                            <>
                                <Button
                                    variant={showGrid.show ? 'contained' : 'outlined'}
                                    color={'primary'}
                                    onClick={() => setShowGrid({ ...showGrid, show: !showGrid.show })}
                                >
                                    Grid
                                </Button>
                                <NumberTextField
                                    width={'70px'}
                                    label='Meters'
                                    value={showGrid.meters}
                                    onChange={(v) => setShowGrid({ ...showGrid, meters: v })}
                                />
                            </>
                        }
                        <MapCoordinates showAsLatLong={layerChosen === 'OSMMap'} />
                    </EditToolBox>
                </Control>

            </EntityMap>
        </Box>
    )
}