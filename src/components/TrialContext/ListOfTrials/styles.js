export const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 300
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  arrowButton: {
    marginLeft: 20
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  table: {
    borderCollapse: "separate",
    borderSpacing: "0 3px"
  },
  firstColumn: {
    fontWeight: "bold",
    maxWidth: 340
  },
  tableBodyRow: {
    boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.05)"
  }
});
