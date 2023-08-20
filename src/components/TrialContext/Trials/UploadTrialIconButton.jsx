import { AttachFile, UploadIcon } from "../../../constants/icons"
import CustomTooltip from "../../CustomTooltip"

export const UploadTrialIconButton = ({ updateTrialFromCsv, updateEntitiesTrialFromCsv }) => {
    return (
        <>
            <CustomTooltip
                title="Upload csv props update"
                ariaLabel="Upload csv update"
                component="label"
            >
                <>
                    <UploadIcon />
                    <input
                        type="file"
                        onChange={updateTrialFromCsv}
                        hidden
                    />
                </>
            </CustomTooltip>
            <CustomTooltip
                title="Upload csv entities update"
                ariaLabel="Upload csv update"
                component="label"
            >
                <>
                    <AttachFile />
                    <input
                        type="file"
                        onChange={(e) => updateEntitiesTrialFromCsv(e, trial)}
                        hidden
                    /></>

            </CustomTooltip>

        </>
    )
}