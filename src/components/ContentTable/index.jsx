import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import React from 'react';
import { withStyles } from '@material-ui/core';
import { styles } from './styles';
import StyledTableCell from '../StyledTableCell';

class ContentTable extends React.Component {
  componentDidMount() {
    const { refetchData } = this.props;
    if (refetchData) refetchData();
  }

  render() {
    const { classes, headerColumns, children } = this.props;

    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {headerColumns.map(({ title, key }) => (
              <StyledTableCell align="left" key={key}>
                {title}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {children.map(child => (
            <TableRow key={child.key} className={classes.tableBodyRow}>
              {child}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(ContentTable);
