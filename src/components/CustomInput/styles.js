export const styles = theme => ({
  input: {
    backgroundColor: theme.palette.white.main,
    padding: '10px 15px',
    fontSize: 14,
  },
  inputWithBorder: {
    backgroundColor: theme.palette.white.main,
    padding: '10px 15px',
    border: `1px solid ${theme.palette.white.dark}`,
    fontSize: 14,
  },
  label: {
    fontSize: 18,
    color: theme.palette.black.dark,
    fontWeight: 'bold',
  },
  formControl: {
    'label + &': {
      marginTop: 20,
    },
  },
  bottomDescription: {
    marginTop: 5,
    lineHeight: '15px',
  },
});
