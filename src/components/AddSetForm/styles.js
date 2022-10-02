export const styles = (theme) => ({
  form: {
    height: '100%',
  },
  attributesHeadlineWrapper: {
    marginTop: 30,
    marginBottom: 50,
  },
  attributesHeadline: {
    display: 'inline-block',
  },
  dropZone: {
    width: '70%',
    marginBottom: 150,
  },
  dropZoneFull: {
    outline: `${theme.palette.gray.main} dashed 1px`,
    color: theme.palette.black.dark,
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
  addButton: {
    marginLeft: 20,
  },
});
