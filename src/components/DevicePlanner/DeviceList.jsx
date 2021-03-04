import React from 'react';
import { List } from '@material-ui/core';
import { DeviceRow } from './DeviceRow';
import { getDeviceLocation, getDeviceLocationProp } from './DeviceUtils';

export const DeviceList = ({ devices, selection, setSelection, removeDeviceLocation, layerChosen }) => {
    const [lastIndex, setLastIndex] = React.useState();

    const handleSelectionClick = (index, doRange) => {
        let sel = [];
        if (!doRange) {
            if (selection.includes(index)) {
                sel = selection.filter(s => s !== index);
            } else {
                sel = selection.concat([index]);
            }
        } else if (lastIndex !== undefined) {
            const low = Math.min(index, lastIndex), high = Math.max(index, lastIndex);
            sel = selection.filter(s => s < low);
            for (let i = low; i <= high; ++i) {
                sel.push(i);
            }
            sel.concat(selection.filter(s => s > high));
        }
        setLastIndex(index);
        setSelection(sel.sort());
    }

    return (
        <div style={{ overflow: 'scroll', height: 'inherit', display: 'block' }}
        // inputProps={{ style: { overflow: 'scroll' } }}
        >
            <List>
                {
                    devices.map(devType =>
                        devType.items.map((dev, index) => {
                            const prop = getDeviceLocationProp(dev, devType);
                            const deviceLocation = (prop && prop.val) ? prop.val.coordinates : undefined;
                            const isDeviceOnLayer = deviceLocation && prop.val.name === layerChosen;
                            const deviceLayerName = deviceLocation ? prop.val.name : null;
                            return <DeviceRow
                                key={dev.key}
                                dev={dev}
                                deviceLocation={deviceLocation}
                                isDeviceOnLayer={isDeviceOnLayer}
                                deviceLayerName={deviceLayerName}
                                isSelected={selection.includes(index)}
                                onClick={e => { handleSelectionClick(index, e.shiftKey) }}
                                onDisableLocation={() => { removeDeviceLocation(index); }}
                            />
                        })
                    )
                }
            </List >
        </div >
    )
}