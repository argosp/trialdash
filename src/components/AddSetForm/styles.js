export const styles = theme => ({
  form: {
    height: '100%',
  },
  attributesHeadline: {
    marginTop: 30,
    marginBottom: 50,
  },
  dropZone: {
    width: '70%',
    marginBottom: 150,
  },
  dropZoneEmpty: {
    width: '70%',
    height: 300,
    textAlign: 'center',
    outline: `${theme.palette.primary.main} dashed 1px`,
    fontSize: 19,
    color: theme.palette.black.dark,
    lineHeight: '300px',
  },
  dropZoneEmptyDragging: {
    outline: `${theme.palette.primary.main} dashed 3px`,
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
});
