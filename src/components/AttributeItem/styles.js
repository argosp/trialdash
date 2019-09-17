export const styles = theme => ({
  root: {
    backgroundColor: theme.palette.white.main,
    padding: '25px 30px 25px 20px',
    border: '2px solid transparent',

    '&:hover': {
      border: '2px solid #56CCF2',
    },
  },
  input: {
    marginLeft: 15,

    '& svg': {
      color: theme.palette.gray.light,
      marginRight: 10,
    },
  },
  attributeButton: {
    marginLeft: 25,
  },
});
