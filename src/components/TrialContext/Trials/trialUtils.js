import { getTrialNameByKey } from "../../../assets/Utils";

export const displayCloneData = (trial, trialsArray) => {
    let clonedFrom = trial.cloneFrom;
    if (trial.cloneFromTrailKey) {
        const clonedFromTrial = trialsArray.find(e=>e.key === trial.cloneFromTrailKey);
        if (clonedFromTrial) {
            clonedFrom = `${clonedFromTrial.name}/${trial.cloneFrom}`;
        }
    }
    return `cloned from ${clonedFrom}`;//state will display
}
