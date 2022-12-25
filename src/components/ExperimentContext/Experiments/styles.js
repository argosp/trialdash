export const styles = (theme) => ({
  arrowButtonTooltip: {
    marginLeft: 20,
  },
  arrowButtonLink: {
    color: theme.palette.black.dark,
    display: "flex",

    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  cellTextLine: {
    margin: 0,
  },
  tableCell: {
    cursor: "pointer",
  },
});
