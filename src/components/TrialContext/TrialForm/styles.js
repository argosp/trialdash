export const styles = theme => ({
  header: {
    marginBottom: 20,
    borderBottom: `1px solid ${theme.palette.white.dark}`,
  },
  property: {
    marginBottom: 20,
  },
  statusBadge: {
    width: 110,
  },
  viewButton: {
    padding: 10,
    border: `1px solid ${theme.palette.white.dark}`,
    backgroundColor: theme.palette.white.main,
    borderRadius: 0,

    '&:hover': {
      color: theme.palette.white.main,
      backgroundColor: theme.palette.primary.main,
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
  viewButtonSelected: {
    color: theme.palette.white.main,
    backgroundColor: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  locationIcon: {
    fontSize: 20,
    transform: 'scale(1.3)',
  },
  devicesPanelHeader: {
    borderBottom: `1px solid ${theme.palette.white.dark}`,
    paddingBottom: 20,
  },
  wrapper: {
    backgroundColor: theme.palette.white.main,
    padding: '25px 30px 25px 20px',
    border: '2px solid transparent',
    marginBottom: 5,

    '&:hover': {
      border: `2px solid ${theme.palette.blue.main}`,
    },
  },
  contentHeader: {
    cursor: 'pointer',
  },
  arrowDown: {
    transform: 'rotate(90deg)',
  },
  deviceGridTable: {
    borderCollapse: 'collapse',
  },
  deviceGridTd: {
    padding: '0 15px 0 15px',
    border: `1px solid ${theme.palette.white.dark}`,
    borderRight: 'none',
    '&:first-child': {
      backgroundColor: 'rgba(195, 195, 195, 0.1)',
    },
    '&:last-child': {
      borderRight: `1px solid ${theme.palette.white.dark}`,
      borderLeft: 'none',
      paddingRight: 15,
    },
  },
  deviceGridTableHead: {
    padding: '15px',
    borderLeft: `1px solid ${theme.palette.white.dark}`,
    backgroundColor: theme.palette.white.main,
    color: theme.palette.black.dark,
    '&:last-child': {
      borderLeft: 'none',
    },
    '&:first-child': {
      borderLeft: 'none',
    },
  },
  deviceGridTableBodyRow: {
    boxShadow: 'none',
  },
  changeStatusButton: {
    color: theme.palette.orange.main,
    border: '2px solid',
    marginBottom: '20px',
    '&:hover': {
      backgroundColor: theme.palette.orange.main,
    },
  },
  changeStatusButtondesign: {
    color: theme.palette.violet.main,
    '&:hover': {
      backgroundColor: theme.palette.violet.main,
    },
  },
});
