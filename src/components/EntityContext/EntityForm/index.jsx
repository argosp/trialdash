/* eslint-disable prefer-destructuring */
import React from 'react';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core';
import uuid from 'uuid/v4';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import entityMutation from './utils/entityMutation';
import { updateCache } from '../../../apolloGraphql';
import {
  ENTITIES_TYPES_DASH,
  ENTITIES_TYPES,
  ENTITIES, ENTITY_MUTATION, ENTITIES_TYPE_MUTATION,
} from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import CustomInput from '../../CustomInput';
import { styles } from './styles';
import Footer from '../../Footer';
import entitiesTypesQuery from '../utils/entityTypeQuery';
import entitiesQuery from '../Entities/utils/entityQuery';

class EntityForm extends React.Component {
  state = {
    entity: {
      key: this.props.entity ? this.props.entity.key : uuid(),
      entitiesTypeKey: this.props.match.params.entitiesTypeKey,
      experimentId: this.props.match.params.id,
      name: this.props.entity ? this.props.entity.name : '',
      properties: this.props.entity && this.props.entity.properties ? this.props.entity.properties : [],
    },
    entitiesType: {},
    number: '',
    prefix: '',
    numberFormat: '',
    suffix: '',
  };

  componentDidMount() {
    const { client, match, entity } = this.props;

    client.query({ query: entitiesTypesQuery(match.params.id) }).then((data) => {
      const entitiesType = data.data.entitiesTypes.find(
        item => item.key === match.params.entitiesTypeKey,
      );

      let properties;
      if (!entity) {
        properties = [];
        entitiesType.properties.forEach(property => properties.push({ key: property.key, val: property.defaultValue }));
      } else {
        properties = entity.properties;
      }

      this.setState(state => ({
        entity: {
          ...state.entity,
          properties,
        },
        entitiesType,
      }));
    });
  }

  onPropertyChange = (e, propertyKey) => {
    if (!e.target) return;
    let { value } = e.target;
    if (e.target.type === 'checkbox') value = e.target.checked.toString();
    let indexOfProperty = this.state.entity.properties.findIndex(
      property => property.key === propertyKey,
    );

    if (indexOfProperty === -1) {
      this.state.entity.properties.push({ val: value, key: propertyKey });
      indexOfProperty = this.state.entity.properties.length - 1;
    }

    this.setState(state => ({
      entity: {
        ...state.entity,
        properties: update(state.entity.properties, {
          [indexOfProperty]: { val: { $set: value } },
        }),
      },
    }));
  };

  onInputChange = (e, inputName) => {
    const { value } = e.target;

    this.setState(state => ({
      entity: {
        ...state.entity,
        [inputName]: value,
      },
    }));
  };

  onMultiChange = (e, inputName) => {
    const { value } = e.target;

    this.setState({
      [inputName]: value,
    });
  };

  closeForm = (deleted) => {
    const { match, history, returnFunc } = this.props;

    if (returnFunc) returnFunc(deleted);
    history.push(
      `/experiments/${match.params.id}/${ENTITIES_TYPES_DASH}/${match.params.entitiesTypeKey}/${ENTITIES}`,
    );
  };

  updateEntitiesTypeNumberOfEntities = (n, cache) => {
    const { match } = this.props;
    const { entitiesType } = this.state;
    entitiesType.numberOfEntities = n[entitiesType.key];
    updateCache(
      cache,
      {data: { [ENTITIES_TYPE_MUTATION]: entitiesType } },
      entitiesTypesQuery(match.params.id),
      ENTITIES_TYPES,
      ENTITIES_TYPE_MUTATION,
      true,
    );
  };

  getNumber = (numberFormat, i) => {
    const startNumber = parseInt(numberFormat, 0);
    const currentNumber = startNumber + i;
    const n = currentNumber.toString();
    return (n.length >= numberFormat.length ? n : new Array(numberFormat.length - n.length + 1).join('0') + n);
  }

  submitEntity = async (newEntity, deleted) => {
    const { match, client, returnFunc } = this.props;
    const { entitiesType, loading } = this.state;
    const { number, prefix, numberFormat, suffix } = this.state;
    if (loading) return;
    this.setState({ loading: true });
    if (deleted) newEntity.state = 'Deleted';
    let property;
    let invalid;
    if (entitiesType.properties) {
      entitiesType.properties.forEach((p) => {
        property = newEntity.properties.find(ntp => ntp.key === p.key);
        if (!property) {
          property = {
            key: p.key,
            val: this.getValue(p.key, p.defaultValue)
          };
          newEntity.properties.push(property);
        }
        if (p.required && !p.trialField && !property.val) {
          invalid = true;
          property.invalid = true;
        } else {
          delete property.invalid;
        }
      });
      if (invalid) {
        this.setState({ tabValue: 0, loading: false });
        return;
      }
    }
    if (window.location.href.match('add-multiple-entities')) {
      let invalid = false;
      let invalidNumber = false;
      let invalidNumberFormat = false;
      let numberFormatError = null;
      if (!number || number === '') {
        invalidNumber = true;
        invalid = true;
      } else {
        invalidNumber = false;
      }
      if (!numberFormat || numberFormat === '') {
        invalidNumberFormat = true;
        invalid = true;
      } else if (!numberFormat.match(/^\d+$/)) {
        invalidNumberFormat = true;
        numberFormatError = 'Invalid number format';
        invalid = true;
      } else {
        invalidNumberFormat = false;
      }
      if (invalid) {
        this.setState({ invalidNumber, invalidNumberFormat, numberFormatError, loading: false });
        return;
      }
    }

    for (let i = 0; i < (window.location.href.match('add-multiple-entities') ? number : 1); i += 1) {
      const clonedEntity = { ...newEntity };
      if (window.location.href.match('add-multiple-entities')) {
        clonedEntity.key = uuid();
        clonedEntity.name = `${prefix}${this.getNumber(numberFormat, i)}${suffix}`;
      }
      
      await client.mutate({
        mutation: entityMutation(clonedEntity),
        update: (cache, mutationResult) => {
          updateCache(
            cache,
            mutationResult,
            entitiesQuery(match.params.id, match.params.entitiesTypeKey),
            ENTITIES,
            ENTITY_MUTATION,
            returnFunc,
            'entitiesTypeKey',
            this.updateEntitiesTypeNumberOfEntities
          );
        },
      });
    }

    this.closeForm(deleted);
  };

  getValue = (key) => {
    const { properties } = this.state.entity;
    const entityTypeProps = this.state.entitiesType.properties
    const staticProp = ((entityTypeProps && entityTypeProps.length) ? entityTypeProps.findIndex(pr => pr.key === key) : -1);
    if(staticProp !== -1 && entityTypeProps[staticProp].static) {
      return entityTypeProps[staticProp].defaultValue
    }
    const p = ((properties && properties.length) ? properties.findIndex(pr => pr.key === key) : -1);
    return (p !== -1 ? properties[p].val : '');
  }

  getInvalid = (key) => {
    const properties = this.state.entity.properties;
    const p = ((properties && properties.length) ? properties.findIndex(pr => pr.key === key) : -1);
    return (p !== -1 ? properties[p].invalid : false);
  }
  setCurrent = (property) => {
    if (property.type === 'time') this.onPropertyChange({ target: { value: moment().format('HH:mm') } }, property.key)
    if (property.type === 'date') this.onPropertyChange({ target: { value: moment().format('YYYY-MM-DD') } }, property.key)
    if (property.type === 'datetime-local') this.onPropertyChange({ target: { value: moment().format('YYYY-MM-DDTHH:mm') } }, property.key)
  }

  render() {
    const { classes } = this.props;
    const { entitiesType, entity, loading } = this.state;
    const { number, prefix, numberFormat, suffix } = this.state;
    return (
      <LoadingOverlay
        active={loading}
        spinner
        text='Saving, please wait...'
      >
        <ContentHeader
          title={`Add ${entitiesType.name}`}
          className={classes.header}
        />
        <Typography style={{ marginBottom: '100px' }}>
          {window.location.href.match('add-multiple-entities') ? 
            <Grid style={{display: 'flex', justifyContent: 'space-between', width: '80%'}}>
              <CustomInput
                id="number"
                onChange={e => this.onMultiChange(e, 'number')}
                value={number}
                label="Number of entities to create"
                type="number"
                className={classes.property}
                invalid={this.state.invalidNumber}
              />
              <CustomInput
                id="prefix"
                onChange={e => this.onMultiChange(e, 'prefix')}
                value={prefix}
                label="Name Prefix"
                type="text"
                className={classes.property}
                placeholder="Example: entityName"
              />
              <CustomInput
                id="numberFormat"
                onChange={e => this.onMultiChange(e, 'numberFormat')}
                value={numberFormat}
                label="Name Number format"
                type="text"
                placeholder="Example: 000"
                invalid={this.state.invalidNumberFormat}
                errorText={this.state.numberFormatError}
                className={classes.property}
              />
              <CustomInput
                id="suffix"
                onChange={e => this.onMultiChange(e, 'suffix')}
                value={suffix}
                label="Name Suffix"
                type="text"
                placeholder="Example: december test"
                className={classes.property}
              />
            </Grid> :
            <CustomInput
              id="entity-name"
              className={classes.property}
              onChange={e => this.onInputChange(e, 'name')}
              label="Name"
              bottomDescription="a short description"
              value={entity.name}
            />
          }
          {entitiesType.properties
            ? entitiesType.properties.filter(p => p.trialField !== true).map(property => (
              <CustomInput
                id={`entity-property-${property.key}`}
                className={classes.property}
                key={property.key}
                onChange={e => this.onPropertyChange(e, property.key)}
                label={property.label}
                bottomDescription={property.description}
                value={this.getValue(property.key)}
                values={property.value}
                disabled={property.static}
                type={property.type}
                multiple={property.multipleValues}
                invalid={this.getInvalid(property.key)}
                endAdornment={(['date', 'time', 'datetime-local'].indexOf(property.type) !== -1) ?
                  <InputAdornment position="end">
                    <Button onClick={()=>this.setCurrent(property)}>
                      Fill current
                    </Button>
                  </InputAdornment> :
                  null
                }
              />
            ))
            : null}
        </Typography>
        <Footer
          cancelButtonHandler={this.closeForm}
          saveButtonHandler={() => this.submitEntity(this.state.entity)}
          withDeleteButton={this.props.entity}
          deleteButtonHandler={() => this.submitEntity(entity, true)}
          loading={loading}
        />
      </LoadingOverlay>
    );
  }
}

export default compose(
  withRouter,
  withApollo,
  withStyles(styles),
)(EntityForm);
