import CustomInput from "../../CustomInput"
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';

export const TrialPropertiesEditor = ({ classes, onInputChange, trial, trialSet, onPropertyChange, getValue }) => {
    const setCurrent = (property) => {
        if (property.type === 'time') onPropertyChange({ target: { value: moment().format('HH:mm') } }, property.key)
        if (property.type === 'date') onPropertyChange({ target: { value: moment().format('YYYY-MM-DD') } }, property.key)
        if (property.type === 'datetime-local') onPropertyChange({ target: { value: moment().format('YYYY-MM-DDTHH:mm') } }, property.key)
    }

    const getInvalid = (key) => {
        const properties = trial.properties;
        const p = ((properties && properties.length) ? properties.findIndex(pr => pr.key === key) : -1);
        return (p !== -1 ? properties[p].invalid : false);
    }

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