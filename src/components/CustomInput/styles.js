export const styles = (theme) => ({
  input: {
    backgroundColor: theme.palette.white.main,
    padding: "10px 15px",
    fontSize: 14,
    border: "1px solid transparent",
  },
  inputWithBorder: {
    backgroundColor: theme.palette.white.main,
    padding: "10px 15px",
    border: `1px solid ${theme.palette.white.dark}`,
    fontSize: 14,
  },
  inputFocused: {
    border: `1px solid ${theme.palette.blue.main}`,
  },
  label: {
    fontSize: 18,
    color: theme.palette.black.dark,
    fontWeight: "bold",
  },
  error: {
    color: "#EB5757",
    fontWeight: "bold",
    fontSize: 13,
  },
  textFieldError: {
    marginTop: "-12px",
    marginBottom: 20,
  },
  formControl: {
    "label + &": {
      marginTop: 20,
    },
  },
  bottomDescription: {
    marginTop: 5,
    lineHeight: "15px",
  },
  switcher: {
    marginLeft: 11,
    marginTop: 10,
    marginBottom: 10,
  },
  textArea: {
    padding: 15,
    width: "100%",
    maxWidth: "100%",
  },
});
