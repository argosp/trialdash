export const styles = theme => ({
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 10,
  },
  description: {
    lineHeight: '15px',
    color: theme.palette.gray.dark,
    fontSize: 12,
    margin: '5px 0 15px 0',
  },
  itemWrapper: {
    padding: 0,

    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  wrapperIcon: {
    color: theme.palette.black.dark,
    fontSize: 25,
  },
  checkedIcon: {
    color: theme.palette.black.dark,
    fontSize: 25,
  },
  label: {
    fontSize: 12,
    marginLeft: 10,
  },
  labelRoot: {
    margin: 0,
  },
});
