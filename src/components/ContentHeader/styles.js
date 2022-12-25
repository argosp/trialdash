export const styles = (theme) => ({
  header: {
    marginBottom: 10,
  },
  backIcon: {
    verticalAlign: "middle",
    marginRight: 10,
    cursor: "pointer",

    "&:hover": {
      color: theme.palette.gray.main,
    },
  },
  topDescription: {
    fontWeight: "bold",
    fontSize: 14,
    color: theme.palette.gray.main,
    margin: 0,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    textTransform: "uppercase",
    textAlign: "left",
    fontWeight: "normal",
    margin: 0,
    color: theme.palette.black.main,
    display: "inline-block",
    verticalAlign: "middle",
  },
  rightDescription: {
    display: "inline-block",
    color: theme.palette.gray.dark,
    margin: "0 0 0 15px",
    fontSize: 16,
    verticalAlign: "bottom",
  },
  middleDescription: {
    margin: "0 0 0 15px",
    verticalAlign: "bottom",
  },
  bottomDescription: {
    color: theme.palette.gray.dark,
    fontSize: 16,
    marginTop: 5,
  },
  search: {
    position: "relative",
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.gray.main,
  },
  inputRoot: {
    color: "inherit",
    height: "100%",
    padding: "0 14px",
    backgroundColor: "#FDFDFD",
    border: "1px solid transparent",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    fontSize: 14,
    [theme.breakpoints.up("md")]: {
      width: 200,
    },
  },
  inputFocused: {
    border: `1px solid ${theme.palette.blue.main}`,
  },
  addButton: {
    marginLeft: 20,
  },
});
