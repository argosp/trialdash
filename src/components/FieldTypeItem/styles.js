export const styles = theme => ({
  wrapper: {
    backgroundColor: theme.palette.white.main,
    padding: '25px 30px 25px 20px',
    border: '2px solid transparent',
    marginBottom: 5,

    '&:hover': {
      border: `2px solid ${theme.palette.blue.main}`,
    },
  },
  wrapperEditMode: {
    border: `2px solid ${theme.palette.primary.main}`,

    '&:hover': {
      border: `2px solid ${theme.palette.primary.main}`,
    },
  },
  input: {
    '& svg': {
      marginRight: 10,
    },
  },
  hiddenAttributeButton: {
    display: 'none',
  },
  crossIcon: {
    display: 'inline-block',
    marginRight: 15,

    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  hiddenCrossIcon: {
    color: theme.palette.white.main,
    marginRight: 15,
  },
});
