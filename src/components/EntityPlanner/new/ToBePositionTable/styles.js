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
  filterCheckbox: {
    color: theme.palette.white.dark,
    '& $checked': {
      color: theme.palette.white.main,
    },
    filterFieldSet: {
      width: '100%'
    },
    customCheckboxWrapper: {
      width: 16, height: 16, border: '0.666667px solid #E0E0E0', display: 'inline'
    },
    customMockCheckbox: {
      zIndex: 10, display: 'flex', alignItems: 'center'
    },
    customCheckboxInput: {
      display: 'none'
    }
  },
  containerChild: {
    padding: '10px 0'
  }
})