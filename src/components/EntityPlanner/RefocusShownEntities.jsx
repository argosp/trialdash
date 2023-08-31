import { useEffect } from "react"
import { usePrevious } from "../../utils/usePrevious";
import { useMap } from "react-leaflet";

export const RefocusShownEntities = ({ shownEntityItems }) => {
    const prevShown = usePrevious(shownEntityItems);
    const mapObj = useMap();
    useEffect(() => {
        const hasPrev = prevShown && prevShown.length > 0;
        const hasCurr = shownEntityItems && shownEntityItems.length > 0;
        if (!hasPrev && hasCurr) {
            const lats = shownEntityItems.map(({ location }) => location[0]);
            const lngs = shownEntityItems.map(({ location }) => location[1]);
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