export const styles = (theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
  },
  headerTitle: {
    width: "45%",
  },
  label: {
    fontSize: 14,
    color: theme.palette.black.dark,
  },
  input: {
    marginBottom: 25,

    "& div": {
      backgroundColor: "#FAFAFA",
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
    minWidth: "100%",
  },
  cancelButton: {
    color: theme.palette.gray.dark,
  },
});
