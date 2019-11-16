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
    const { client, contentType, query } = this.props;

    try {
      const items = client.readQuery({
        query,
      })[contentType];

      this.setState({ [contentType]: items });
    } catch {
      this.getItemsFromServer();
    }
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;

    if (prevProps.match.params.id !== match.params.id) {
      this.getItemsFromServer();
    }
  }

  getItemsFromServer = () => {
    const { query, contentType, client } = this.props;

    client
      .query({
        query,
      })
      .then((data) => {
        this.setState({ [contentType]: data.data[contentType] });
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
        <TableHead>
          <TableRow>
            {tableHeadColumns.map(({ title, key }) => (
              <StyledTableCell align="left" key={key}>
                {title}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
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
