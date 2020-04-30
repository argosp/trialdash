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
});
