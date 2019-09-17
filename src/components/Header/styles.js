export const styles = theme => ({
  root: {
    padding: '20px 0 0 40px',
    backgroundColor: theme.palette.white.main,
  },
  logo: {
    color: theme.palette.primary.main,
    fontSize: 24,
    textTransform: 'uppercase',
    textDecoration: 'none',
    marginRight: 20,
    marginTop: 4,
  },
  divider: {
    backgroundColor: theme.palette.white.dark,
    height: 45,
    width: 1,
    marginRight: 20,
  },
  expandButton: {
    fontWeight: 'bold',
    paddingTop: 6,

    '&:hover': {
      backgroundColor: theme.palette.white.main,
      color: theme.palette.gray.main,
    },
  },
  tab: {
    paddingBottom: 30,
    fontWeight: 'bold',
    fontSize: 14,

    '&.Mui-selected': {
      color: theme.palette.black.main,

      '&:hover': {
        color: theme.palette.black.main,
      },
    },

    '&:hover': {
      color: theme.palette.gray.main,
    },
  },
});

export const tabsStyles = theme => ({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: 5,

    '& > div': {
      width: '100%',
      backgroundColor: theme.palette.primary.main,
    },
  },
});
