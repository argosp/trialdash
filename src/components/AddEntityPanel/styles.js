export const styles = theme => ({
  headerTitle: {
    fontSize: 18,
    margin: 0,
  },
  rootPanel: {
    width: '50%',
    top: 80,
    position: 'absolute',
  },
  tabsWrapper: {
    padding: '25px 20px 0px 0px',
    borderBottom: `1px solid ${theme.palette.white.dark}`,
  },
  viewButton: {
    padding: '9px',
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
    borderRadius: 3,
  },
  headCell: {
    padding: '15px 0 15px 19px',
    backgroundColor: theme.palette.white.main,
    fontSize: 14,
    fontWeight: 'bold',
  },
  tableBodyRow: {
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.white.dark}`,
  },
  tableCell: {
    padding: '15px 0 15px 19px',
    cursor: 'pointer',
    borderBottom: `1px solid ${theme.palette.white.dark}`,
  },
  entityTableCell: {
    padding: '0 0 0 19px',
    borderBottom: `1px solid ${theme.palette.white.dark}`,
    color: theme.palette.gray.dark,
    fontSize: 13,
  },
  entityNameTableCell: {
    color: theme.palette.black.dark,
    fontWeight: 600,
    fontSize: 14,
  },
  entityActionsTableCell: {
    padding: '0 19px 0 19px',
  },
  title: {
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '17px',
    color: theme.palette.black.dark,
  },
  bottomDescription: {
    fontSize: 12,
    lineHeight: '15px',
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 0 0 19px',
    height: 65,
    background: theme.palette.white.medium,
    color: theme.palette.gray.main,
    borderBottom: `1px solid ${theme.palette.white.dark}`,
  },
  entitiesTypeTitle: {
    padding: '15px 0 15px 19px',
    borderBottom: `1px solid ${theme.palette.white.dark}`,
  },
  header: {
    borderBottom: 'none',
  },
});
