export const styles = (theme) => ({
  root: {
    marginBottom: 35,
  },
  title: {
    fontSize: 14,
    color: theme.palette.black.dark,
    fontWeight: "bold",
    margin: 0,
  },
  description: {
    fontSize: 12,
    color: theme.palette.gray.dark,
    margin: 0,
  },
});

export const switcher = (theme) => ({
  root: {
    width: 33,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.white.main,

    "&$checked": {
      transform: "translateX(17px)",
      color: theme.palette.white.main,

      "& + $track": {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },

      "&:hover": {
        backgroundColor: "transparent",
      },
    },

    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.gray.medium}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.gray.medium,
  },
  checked: {},
});
