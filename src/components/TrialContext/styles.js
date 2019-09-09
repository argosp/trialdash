import { fade } from "@material-ui/core/styles";

export const styles = theme => ({
  header: {
    marginBottom: 25
  },
  title: {
    fontSize: 24,
    textTransform: "uppercase",
    textAlign: "left",
    fontWeight: "normal",
    margin: 0,
    color: "#333333"
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#828282"
  },
  inputRoot: {
    color: "inherit",
    height: "100%",
    padding: "0 14px",
    backgroundColor: "#FDFDFD",
    borderRadius: 5
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    fontSize: 14,
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  },
  searchButton: {
    color: "#fff",
    marginLeft: 20,
    padding: "10px 45px"
  }
});
