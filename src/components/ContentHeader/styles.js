export const styles = theme => ({
  header: {
    marginBottom: 10,
  },
  backIcon: {
    verticalAlign: 'middle',
    marginRight: 10,
    cursor: 'pointer',

    '&:hover': {
      color: theme.palette.gray.main,
    },
  },
  title: {
    fontSize: 24,
    textTransform: 'uppercase',
    textAlign: 'left',
    fontWeight: 'normal',
    margin: 0,
    color: theme.palette.black.main,
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  rightDescription: {
    color: theme.palette.gray.dark,
    marginLeft: 15,
    fontSize: 16,
    verticalAlign: 'bottom',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.gray.main,
  },
  inputRoot: {
    color: 'inherit',
    height: '100%',
    padding: '0 14px',
    backgroundColor: '#FDFDFD',
    borderRadius: 5,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: 14,
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  addButton: {
    color: '#fff',
    marginLeft: 20,
    padding: '10px 45px',
  },
});
