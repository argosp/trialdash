export const styles = theme => ({
  headerTitle: {
    fontSize: 18,
    margin: 0,
  },
  fieldTypeWrapper: {
    padding: 30,
    borderBottom: `1px solid ${theme.palette.white.dark}`,
    fontWeight: 'bold',
    backgroundColor: theme.palette.white.main,
  },
  fieldTypeWrapperCopy: {
    '& ~ div': {
      transform: 'none !important',
    },
  },
  fieldTypeTitle: {
    marginLeft: 25,
  },
});
