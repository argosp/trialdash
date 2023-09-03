import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import React from 'react';
import { withStyles } from '@mui/styles';
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
    const { client, contentType, query, items, getData } = this.props;
    if (items) {
      this.setItems();
      return;
    }
    try {
      const resItems = client.readQuery({
        query,
      })[contentType];

      this.setState({ [contentType]: resItems });
      if (getData) getData(resItems);
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
  renderTableRow
  setItems = () => {
    const { items, contentType, update, setUpdated, getData } = this.props;
    this.setState({ [contentType]: items });
    if (getData) getData(items);
    if (setUpdated && update) setUpdated();
  }

  getItemsFromServer = () => {
    const { query, contentType, client, setUpdated, update, getData } = this.props;

    client
      .query({
        query,
      })
      .then((data) => {
        data.data[contentType] = data.data[contentType] ? data.data[contentType].filter(d => d.state !== 'Deleted') : [];
        this.setState({ [contentType]: data.data[contentType] });
        if (getData) getData(data.data[contentType]);
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
          {this.state[contentType] && this.state[contentType].map(renderRow).map((child, i) => (
            <TableRow key={i} className={classes.tableBodyRow}>
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
