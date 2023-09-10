import { useEffect } from "react"
import { usePrevious } from "../../utils/usePrevious";
import { useMap } from "react-leaflet";

export const RefocusShownEntities = ({ shownEntityItems }) => {
    const prevShown = usePrevious(shownEntityItems);
    const mapObj = useMap();
    useEffect(() => {
        const locatedEntities = (shownEntityItems || []).filter(({ location, isOnLayer }) => {
            return isOnLayer && location && location.length && isFinite(location[0]) && isFinite(location[1]);
        });
        const hasPrev = prevShown && prevShown.length > 0;
        const hasCurr = locatedEntities && locatedEntities.length > 0;
        if (!hasPrev && hasCurr) {
            const lats = locatedEntities.map(({ location }) => location[0]);
            const lngs = locatedEntities.map(({ location }) => location[1]);

            const left = Math.min(...lngs);
            const right = Math.max(...lngs);

            const lower = Math.min(...lats);
            const upper = Math.max(...lats);

            if (left === right && upper === lower) {
                mapObj.panTo([upper, left]);
            } else {
                const bounds = [[upper, left], [lower, right]];
                mapObj.fitBounds(bounds);
            }
        }
    }, [shownEntityItems])
    return null;
}