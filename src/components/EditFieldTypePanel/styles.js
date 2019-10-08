export const styles = theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 25,

    '& div': {
      backgroundColor: '#FAFAFA',
    },
  },
  content: {
    padding: 15,
  },
  requiredSwitch: {
    marginTop: 10,
  },
  templateInput: {
    marginTop: 15,
  },
  buttonsWrapper: {
    paddingTop: 30,
  },
  button: {
    minWidth: '100%',
  },
  cancelButton: {
    color: theme.palette.gray.dark,
  },
});
