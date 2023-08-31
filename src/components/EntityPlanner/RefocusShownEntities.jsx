import { useEffect } from "react"
import { usePrevious } from "../../utils/usePrevious";
import { useMap } from "react-leaflet";

export const RefocusShownEntities = ({ shownEntityItems }) => {
    const prevShown = usePrevious(shownEntityItems);
    const mapObj = useMap();
    useEffect(() => {
        const locatedEntities = (shownEntityItems || []).filter(e => {
            return e.location && e.location.length && isFinite(e.location[0]) && isFinite(e.location[1]);
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
            const bounds = [[upper, left], [lower, right]];
            mapObj.fitBounds(bounds);
        }
    }, [shownEntityItems])
    return null;
}