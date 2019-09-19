export const styles = theme => ({
  root: {
    display: 'block',
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: theme.palette.white.main,
    height: '100vh',
    overflowY: 'auto',
    width: 340,
    boxShadow: '-9px 0px 14px rgba(60, 60, 60, 0.05)',
  },
  hiddenRoot: {
    display: 'none',
  },
  headerWrapper: {
    padding: '25px 20px 20px 25px',
    borderBottom: `1px solid ${theme.palette.white.dark}`,
  },
  closeIcon: {
    cursor: 'pointer',

    '&:hover': {
      color: theme.palette.gray.main,
    },
  },
});
