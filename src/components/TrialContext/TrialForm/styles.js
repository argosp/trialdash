export const styles = theme => ({
  header: {
    marginBottom: 20,
    borderBottom: `1px solid ${theme.palette.white.dark}`,
  },
  property: {
    marginBottom: 20,
  },
  statusBadge: {
    cursor: 'pointer',
    maxWidth: 'unset',
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
  entitiesPanelHeader: {
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
  entityGridTable: {
    borderCollapse: 'collapse',
  },
  entityGridTd: {
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
  entityGridTableHead: {
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
  entityGridTableBodyRow: {
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
  penIcon: {
    width: 16,
    height: 15,
    margin: '0 0 0 12px',
  },
  menu: {
    boxShadow: '0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)',
    borderRadius: 0,
    marginTop: '6px',
    marginLeft: '-5px',
  },
  menuItem: {
    textTransform: 'Capitalize',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: '19px',
    color: theme.palette.gray.dark,
    padding: '13.5px 100px 13.55px 16px',
    '&:hover': {
      backgroundColor: theme.palette.blue.light,
    },
  },
  rect: {
    width: 24,
    height: 24,
    border: '2px solid',
    boxSizing: 'border-box',
    marginRight: 21,
  },
  design: {
    border: `2px solid ${theme.palette.violet.main}`,
  },
  deploy: {
    border: `2px solid ${theme.palette.orange.main}`,
  },
  execution: {
    border: `2px solid ${theme.palette.orange.main}`,
  },
  complete: {
    border: `2px solid ${theme.palette.gray.light}`,
  },
});
