export const styles = theme => ({
  root: {
    marginBottom: 5,
  },
  wrapper: {
    backgroundColor: theme.palette.white.main,
    padding: '25px 30px 25px 20px',
    border: '2px solid transparent',

    '&:hover': {
      border: '2px solid #56CCF2',
    },
  },
  input: {
    '& svg': {
      marginRight: 10,
    },
  },
  attributeButton: {
    display: 'inline',
    marginLeft: 25,
    color: theme.palette.black.dark,
  },
  hiddenAttributeButton: {
    display: 'none',
  },
  crossIcon: {
    display: 'inline-block',
    marginRight: 15,
  },
  hiddenCrossIcon: {
    color: theme.palette.white.main,
  },
});
