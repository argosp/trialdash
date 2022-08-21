export const styles = (theme) => ({
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
});

export const tabsStyles = (theme) => ({
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
