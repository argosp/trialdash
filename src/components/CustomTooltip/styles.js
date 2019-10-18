function arrowGenerator(color) {
  return {
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.95em',
      width: '3em',
      height: '1em',

      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${color} transparent`,
      },
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.95em',
      width: '3em',
      height: '1em',

      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: `${color} transparent transparent transparent`,
      },
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.95em',
      height: '3em',
      width: '1em',

      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent ${color} transparent transparent`,
      },
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.95em',
      height: '3em',
      width: '1em',

      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent ${color}`,
      },
    },
  };
}

export const styles = theme => ({
  root: {
    color: theme.palette.black.dark,

    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.white.main,
    },
  },
  arrow: {
    position: 'absolute',
    fontSize: 6,
    width: '3em',
    height: '3em',

    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  },
  popper: arrowGenerator(theme.palette.gray.soft),
  tooltip: {
    backgroundColor: theme.palette.gray.soft,
    borderRadius: 10,
    padding: '8px 15px',
    fontSize: 13,
  },
  placementLeft: {
    margin: '0 8px',
  },
  placementRight: {
    margin: '0 8px',
  },
  placementTop: {
    margin: '8px 0',
  },
  placementBottom: {
    margin: '8px 0',
  },
});
