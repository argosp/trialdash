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
    border: `1px dashed ${theme.palette.primary.main}`,
    textAlign: 'center',
  },
  dropZoneText: {
    fontSize: 19,
    color: theme.palette.black.dark,
    lineHeight: '300px',
  },
});
