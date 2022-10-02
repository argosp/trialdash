import React from 'react';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ContentHeader from '../../../ContentHeader';
import ContentTable from '../../../ContentTable';
import StyledTableCell from '../../../StyledTableCell';
import CustomTooltip from '../../../CustomTooltip';
import CustomInput from '../../../CustomInput';
import { BasketIcon } from '../../../../constants/icons';
import { PlusIcon } from '../../../../constants/icons';
import ContainsEntitiesDisplayList from '../TrialEntities/ContainsEntitiesDisplayList';

import { ENTITIES } from '../../../../constants/base';

class EntitiesGrid extends React.Component {
  state = {
    openContentHeader: {},
    CloneEntitiesDialogOpen: false,
  };

  entityTableHeadColumns = (entitiesType) => {
    if (!entitiesType || !this) return [];
    const headers = [{ key: entitiesType.key, title: 'entity name' }];
    entitiesType.properties.forEach((p) => headers.push({ key: p.key, title: p.label }));
    headers.push({ key: `${entitiesType.key}-actions`, title: '' });
    return headers;
  };

  renderEntitiesTableRow = (entity) => {
    const {
      classes,
      removeEntity,
      onEntityPropertyChange,
      entities,
      entitiesTypes,
      trial,
      openAddEntitiesPanel,
      updateEntityInParent,
    } = this.props;
    if (!entities[entity.key]) return <React.Fragment key={entity.key} />;
    return (
      <React.Fragment key={entity.key}>
        <StyledTableCell
          classes={{ body: classes.entityGridTd }}
          className={classes.tableCell}
          align="left">
          {entities[entity.key][0].name}
        </StyledTableCell>
        {entitiesTypes[entity.entitiesTypeKey] &&
          entitiesTypes[entity.entitiesTypeKey][0] &&
          entitiesTypes[entity.entitiesTypeKey][0].properties &&
          entitiesTypes[entity.entitiesTypeKey][0].properties.map((property) => (
            <>
              {property.trialField ? (
                <StyledTableCell
                  classes={{ body: classes.entityGridTd }}
                  key={`entity-property-${property.key}-${trial.status}`}
                  align="left">
                  <CustomInput
                    value={
                      entity.properties && entity.properties.find((p) => p.key === property.key)
                        ? entity.properties.find((p) => p.key === property.key).val
                        : ''
                    }
                    onChange={(e) => onEntityPropertyChange(entity, e, property.key)}
                    id={`entity-property-${property.key}-${trial.status}`}
                    className={classes.input}
                    type={property.type}
                    values={property.value}
                    multiple={property.multipleValues}
                  />
                </StyledTableCell>
              ) : (
                <StyledTableCell
                  classes={{ body: classes.entityGridTd }}
                  key={property.key}
                  align="left">
                  {entities[entity.key][0].properties.find((p) => p.key === property.key)
                    ? entities[entity.key][0].properties.find((p) => p.key === property.key).val
                    : ''}
                </StyledTableCell>
              )}
            </>
          ))}
        <StyledTableCell classes={{ body: classes.entityGridTd }} align="right">
          {entity.containsEntities && entity.containsEntities.length ? (
            <ContainsEntitiesDisplayList
              entity={entity}
              experimentEntitiesArray={entities}
              trialEntitiesArray={trial.entities}
              classes={classes}
              removeEntityFromParent={updateEntityInParent}></ContainsEntitiesDisplayList>
          ) : (
            ''
          )}
          <CustomTooltip title="Delete" ariaLabel="delete" onClick={() => removeEntity(entity.key)}>
            <BasketIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Add entity"
            ariaLabel="Add entity"
            onClick={(e) => openAddEntitiesPanel(e, entity)}>
            <PlusIcon />
          </CustomTooltip>
        </StyledTableCell>
      </React.Fragment>
    );
  };

  openTable = (e, currentContent) => {
    const tmp = this.state[currentContent];
    tmp[e] = !this.state[currentContent][e];
    this.setState({ [currentContent]: tmp });
  };
  SetCloneEntitiesDialogOpen = (open) => {
    this.setState({ CloneEntitiesDialogOpen: open });
  };
  render() {
    const { classes, trialEntities, entitiesTypes, update, setUpdated } = this.props;
    const { openContentHeader } = this.state;
    return (
      <>
        {Object.keys(trialEntities)
          .filter((e) => Object.keys(entitiesTypes).indexOf(e) !== -1)
          .map((e) => (
            <Grid className={classes.wrapper} key={e}>
              <ContentHeader
                onClick={() => this.openTable(e, 'openContentHeader')}
                className={classes.contentHeader}
                title={entitiesTypes && entitiesTypes[e] && entitiesTypes[e][0].name}
                bottomDescription={
                  entitiesTypes && entitiesTypes[e] && entitiesTypes[e][0].description
                }
                rightComponent={
                  <>
                    <CustomTooltip
                      title="Open"
                      className={openContentHeader[e] ? classes.arrowDown : ''}
                      ariaLabel="open">
                      <ArrowForwardIosIcon />
                    </CustomTooltip>
                  </>
                }
              />
              <Collapse in={openContentHeader[e]} timeout="auto" unmountOnExit>
                <ContentTable
                  classes={{
                    table: classes.entityGridTable,
                    head: classes.entityGridTableHead,
                    tableBodyRow: classes.entityGridTableBodyRow,
                  }}
                  items={trialEntities[e]}
                  contentType={ENTITIES}
                  tableHeadColumns={this.entityTableHeadColumns(
                    entitiesTypes && entitiesTypes[e] && entitiesTypes[e][0]
                  )}
                  renderRow={this.renderEntitiesTableRow}
                  update={update}
                  setUpdated={setUpdated}
                />
              </Collapse>
            </Grid>
          ))}
      </>
    );
  }
}

export default EntitiesGrid;
