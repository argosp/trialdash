import { getTrialNameByKey } from "../../../assets/Utils";

export const displayCloneData = (trial, trialsArray) => {
    return trial.cloneFromTrailKey ?
        `cloned from ${getTrialNameByKey(trial.cloneFromTrailKey, trialsArray)}/${trial.cloneFrom}` :
        `cloned from ${trial.cloneFrom}`;//state will display
}
