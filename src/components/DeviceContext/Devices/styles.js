export const styles = theme => ({
  checkboxWrapper: {
    height: 24,
    width: 24,
    margin: '0 15px 0 -7px',
  },
  selectedRow: {
    background: theme.palette.blue.light,
  },
  menu: {
    background: theme.palette.white.main,
    boxShadow: 'none',
    border: `1px solid ${theme.palette.white.dark}`,
    boxSizing: 'border-box',
    borderRadius: '0',
  },
  menuItem: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: '19px',
    color: theme.palette.gray.dark,
  },
  tableCellLast: {
    padding: '15px 15px 15px 30px',
  },
  tableCellPointer: {
    cursor: 'pointer',
  },
});
