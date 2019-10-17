export const styles = theme => ({
  root: {
    padding: '20px 0 0 40px',
    backgroundColor: theme.palette.white.main,
  },
  rootWithoutExperiments: {
    padding: '20px 0 15px 40px',
  },
  logoWrapper: {
    marginTop: 4,
    marginRight: 20,
  },
  menuIcon: {
    cursor: 'pointer',
    marginRight: 15,
  },
  logo: {
    color: theme.palette.primary.main,
    fontSize: 24,
    textTransform: 'uppercase',
    textDecoration: 'none',
    zIndex: 5,
  },
  divider: {
    backgroundColor: theme.palette.white.dark,
    height: 45,
    width: 1,
  },
  leftDivider: {
    marginRight: 20,
  },
  rightDivider: {
    marginLeft: 60,
    marginRight: 15,
  },
  expandButton: {
    '&:hover': {
      backgroundColor: theme.palette.white.main,
      color: theme.palette.gray.main,
    },
  },
  expandExperimentButton: {
    fontWeight: 'bold',
    paddingTop: 6,
  },
  expandProfileButton: {
    textTransform: 'none',
    fontSize: 16,
    padding: 0,
    margin: '3px 20px 0 15px',
    height: 'fit-content',
  },
  tab: {
    paddingBottom: 30,
    fontWeight: 'bold',
    fontSize: 14,
    minHeight: 'auto',

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
  avatar: {
    width: 36,
    height: 36,
  },
  profileWrapper: {
    marginTop: 3,
    display: 'flex',
    alignItems: 'flex-start',
  },
});

export const tabsStyles = theme => ({
  root: {
    minHeight: 'auto',
  },
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
