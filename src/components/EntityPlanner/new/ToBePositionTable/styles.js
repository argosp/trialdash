export const styles = (theme) => ({
  root: {
    height: '100%',
    width: 650,
    backgroundColor: '#fefefe',
    position: 'absolute',
    top: 0,
    left: '100%',
    zIndex: 1000
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    // paddingLeft: theme.spacing(4),
    backgroundColor: 'rgba(245, 245, 245, 0.5)',
    margin: '2px 14px',
    borderBottom: '1px solid #E0E0E0',
  },
  subheader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    color: 'black'
  },
  row: {
    display: 'flex',
    padding: '18px 0'
  },
  flexItem1: {
    flex: 1
  },
  flexItemEx: {
    flex: 1.6
  },
  flexItem2: {
    flex: 2,
  },
  colText: {
    color: '#4F4F4F',
    fontSize: 10,
    fontWeight: 800
  },
  colRowText: {
    color: '#828282',
    fontSize: 14,
    fontWeight: 500
  },
  rowTitleText: {
    fontWeight: 600,
    fontSize: 14,
    color: 'black',
    flex: 2
  },
  iconButton: {
    textAlign: 'center',
    padding: 4
  },
  addIconWrapper: {
    right: 2
  },
  tabs: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    paddingBottom: 0,
    marginBottom: 8
  },
  deviceTypesList: {
    height: 350,
    overflow: 'auto'
  }
  , container: {
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
  },
  editTable:
  {
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.04), 0px 20px 25px rgba(0, 0, 0, 0.1)',
    width: 50
  },
  tool: {
    backgroundColor: theme.palette.white.main,
    boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.04), 0px 20px 25px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'row',
    width: 250,
    marginTop: 6,
    gap: 5,
    '& .toolItem': {
      display: 'flex',
      justifyContent: 'space-around',
      '& > *': {
        width: '40%'
      }
    },
    '& .button': {
      width: '95%',
      margin: '10px auto'
    }

  },
  toolBoxContainer: {
    backgroundColor: theme.palette.white.main
  },
  toolBoxItem: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',

  }
})