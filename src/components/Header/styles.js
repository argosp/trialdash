export const styles = theme => ({
  root: {
    padding: '0 0 0 0',
    backgroundColor: theme.palette.white.main,
  },
  rootWithoutExperiments: {
    padding: '0 0 15px 0',
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
    color: theme.palette.black.main,
    fontWeight: 'bold',
    paddingTop: 6,
  },
  expandProfileButton: {
    color: theme.palette.black.dark,
    textTransform: 'none',
    fontSize: 16,
    padding: 0,
    margin: '3px 20px 0 15px',
    height: 'fit-content',
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
