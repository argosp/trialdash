export const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  arrowButton: {
    marginLeft: 20,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  table: {
    borderCollapse: 'separate',
    borderSpacing: '0 3px',
  },
  firstColumn: {
    fontWeight: 'bold',
    maxWidth: 340,
  },
  tableBodyRow: {
    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.05)',
  },
});

export const tableCellStyles = theme => ({
  head: {
    backgroundColor: theme.palette.background.default,
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#4F4F4F',
    fontWeight: 'bold',
    border: 0,
  },
  body: {
    backgroundColor: theme.palette.white.main,
    padding: '15px 0 15px 20px',
    border: 0,
  },
});
