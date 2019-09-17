export const styles = theme => ({
  input: {
    backgroundColor: theme.palette.white.main,
    padding: '10px 5px',
  },
  inputWithBorder: {
    backgroundColor: theme.palette.white.main,
    padding: '10px 15px',
    border: `1px solid ${theme.palette.white.dark}`,
    fontSize: 14,
  },
  label: {
    top: -10,
    fontSize: 14,
    color: theme.palette.black.dark,
    fontWeight: 'bold',
  },
  formControl: {
    'label + &': {
      marginTop: 10,
    },
  },
  bottomDescription: {
    marginTop: 5,
  },
});
