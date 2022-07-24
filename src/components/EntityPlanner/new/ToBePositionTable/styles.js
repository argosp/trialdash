export const styles = (theme) => ({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    position: 'relative',
    padding: 10,
    "& .tbpRow": {
      padding: "10px 0",
      width: '100%'
    },
  },
  filterBox: {
    position: 'absolute',
    left: '50%',
    top: '44%',
    zIndex: 1,
    width: 125,
    padding: '10px 20px',
    backgroundColor: theme.palette.white.main,
    boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.04), 0px 20px 25px rgba(0, 0, 0, 0.1)'
  },
  containerChild: {
    padding: '10px 0'
  },
  tbpEntity: {
    width: '100%',
    backgroundColor: theme.palette.white.main,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #E0E0E0',
    '& .titles': {
      marginRight: 'auto'
    }
  }
})