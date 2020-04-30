import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import React from 'react';
import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { styles } from './styles';
import StyledTableCell from '../StyledTableCell';

class ContentTable extends React.Component {
  state = {
    [this.props.contentType]: [],
  };

  componentDidMount() {
    const { client, contentType, query, items } = this.props;
    if (items) {
      this.setItems();
      return;
    }
    try {
      const resItems = client.readQuery({
        query,
      })[contentType];

      this.setState({ [contentType]: resItems });
    } catch {
      this.getItemsFromServer();
    }
  }

  componentDidUpdate(prevProps) {
    const { match, update, items } = this.props;
    if (prevProps.match.params.id !== match.params.id || update) {
      if (items) {
        this.setItems();
        return;
      }
      this.getItemsFromServer();
    }
  }

  setItems = () => {
    const { items, contentType, update, setUpdated } = this.props;
    this.setState({ [contentType]: items });
    if (setUpdated && update) setUpdated();
  }

  getItemsFromServer = () => {
    const { query, contentType, client, setUpdated, update } = this.props;

    client
      .query({
        query,
      })
      .then((data) => {
        data.data[contentType] = data.data[contentType].filter(d => d.state !== 'Deleted');
        this.setState({ [contentType]: data.data[contentType] });
        if (setUpdated && update) setUpdated();
      });
  };

  render() {
    const {
      tableHeadColumns,
      renderRow,
      contentType,
      classes,
    } = this.props;

    return (
      <Table className={classes.table}>
        {tableHeadColumns
          && (
            <TableHead>
              <TableRow>
                {tableHeadColumns.map(({ title, key }) => (
                  <StyledTableCell className={classes.headCell} align="left" key={key}>
                    {title}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
          )
        }
        <TableBody>
          {this.state[contentType].map(renderRow).map(child => (
            <TableRow key={child.key} className={classes.tableBodyRow}>
              {child}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default compose(
  withApollo,
  withRouter,
  withStyles(styles),
)(ContentTable);
