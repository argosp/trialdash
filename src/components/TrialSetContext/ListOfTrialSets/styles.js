
export const  styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        height: 600
    },
    form: {
      display: 'flex',
      flexDirection: 'column'
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 300,
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2,
    },
    button: {
      margin: theme.spacing.unit * 2
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
      },
  });