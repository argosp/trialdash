import CustomInput from "../../CustomInput"
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';

export const TrialPropertiesEditor = ({ classes, onInputChange, trial, trialSet, onPropertyChange, getValue, getInvalid, setCurrent }) => {
    return (
        <>
            <CustomInput
                id="trial-name"
                className={classes.property}
                onChange={e => onInputChange(e, 'name')}
                label="Name"
                bottomDescription="a short description"
                value={trial.name}
            />
            {
                trialSet.properties
                    ? trialSet.properties.map(property => (
                        <CustomInput
                            id={`trial-property-${property.key}`}
                            className={classes.property}
                            key={property.key}
                            onChange={e => onPropertyChange(e, property.key)}
                            label={property.label}
                            bottomDescription={property.description}
                            value={getValue(property.key, property.defaultValue)}
                            values={property.value}
                            multiple={property.multipleValues}
                            type={property.type}
                            invalid={getInvalid(property.key)}
                            endAdornment={(['date', 'time', 'datetime-local'].indexOf(property.type) !== -1) ?
                                <InputAdornment position="end">
                                    <Button onClick={() => setCurrent(property)}>
                                        Fill current
                                    </Button>
                                </InputAdornment> :
                                null
                            }
                        />
                    ))
                    : null
            }
        </>
    )
}