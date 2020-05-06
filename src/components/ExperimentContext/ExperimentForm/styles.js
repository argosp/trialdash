export const styles = theme => ({
  header: {
    marginBottom: 45,
  },
  input: {
    marginBottom: 30,
  },
  dates: {
    marginBottom: 30,
  },
  locationInput: {
    marginBottom: 10,
  },
  dateTooltip: {
    padding: 0,
  },
  map: {
    position: 'absolute',
    width: 500,
    height: 340,
    zIndex: 0,
    marginBottom: 100,
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
