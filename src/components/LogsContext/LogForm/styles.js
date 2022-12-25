export const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  fileUploadBtn: {
    textTransform: "initial",
    borderTop: `1px dashed ${theme.palette.action.disabled}`,
  },
  wrapperEditor: {
    border: `1px solid ${theme.palette.action.disabled}`,
  },
  mdEditor: {
    boxShadow: "none",
  },
  labelBtn: {
    justifyContent: "flex-start",
    fontWeight: "normal",
  },
  labelsDivider: {
    margin: "20px 0",
  },
  labelChip: {
    margin: theme.spacing(0.5),
    color: "white",
  },
  sideListItem: {
    borderBottom: "1px solid #c4c4c4",
  },
  datePickerInput: {
    visibility: "hidden",
    width: 1,
  },
});
