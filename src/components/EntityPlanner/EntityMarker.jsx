import React from 'react';
import { Marker, Popup } from "react-leaflet";
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { ReactComponent as CellTowerIcon } from "./CellTowerIcon.svg";

export const EntityMarker = ({ entity, devLocation, isSelected, isTypeSelected, isOnEdit, shouldShowName, handleMarkerClick, onContextMenu }) => (
    <Marker key={entity.name}
        position={devLocation}
        // onclick={() => handleMarkerClick(entity)}
        oncontextmenu={onContextMenu}
        title={entity.name}
        icon={divIcon({
            iconSize: [20, 20],
            iconAnchor: [10, 22],
            html: renderToStaticMarkup(
                <div>
                    <i className="fas fa-circle fa-lg"
                        style={{ color: (isOnEdit ? '#2D9CDB' : '#27AE60') }}
                    // save this comment to future develop with groups
                    // style={{ color: (isTypeSelected ? (isSelected ? '#9B51E0' : '#2D9CDB') : '#27AE60') }}
                    />
                    {!shouldShowName ? null :
                        <span style={{ backgroundColor: "yellow", padding: 3, borderColor: "black" }}>
                            {entity.name.replace(/ /g, '\u00a0')}
                        </span>
                    }
                </div>
            )
        })}
    >
        <Popup position={[devLocation[0] + 0.0008, devLocation[1]]}>
            <div style={{ display: "flex", height: "4vh" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        height: "100%",
                        width: "10%",
                        alignItems: "center",
                        marginRight: "15px",
                    }}
                >
                    <CellTowerIcon />
                </div>
                <div style={{}}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: "50%",
                            fontFamily: "Inter",
                            fontStyle: "normal",
                            fontWeight: 600,
                            fontSize: "13px",
                            lineHeight: "16px",
                        }}
                    >
                        {entity.name}
                    </div>
                    <div
                        style={{
                            height: "50%",
                            fontFamily: "Inter",
                            fontStyle: "normal",
                            fontWeight: 400,
                            fontSize: "12px",
                            lineHeight: "15px",
                        }}
                    >{`${Math.round(devLocation[0] * 10000000) / 10000000} X ${Math.round(devLocation[1] * 10000000) / 10000000
                        } `}</div>
                </div>
            </div>
        </Popup>

    </Marker >
)
