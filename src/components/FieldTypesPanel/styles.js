export const styles = (theme) => ({
  headerTitle: {
    fontSize: 18,
    margin: 0,
  },
  fieldTypeWrapper: {
    padding: 30,
    borderBottom: `1px solid ${theme.palette.white.dark}`,
    fontWeight: "bold",
    backgroundColor: theme.palette.white.main,
  },
  fieldTypeWrapperDragging: {
    boxShadow:
      "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)",
  },
  fieldTypeWrapperCopy: {
    "& ~ div": {
      transform: "none !important",
    },
  },
  fieldTypeTitle: {
    marginLeft: 25,
  },
});
