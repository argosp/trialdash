export const styles = theme => ({
    paper: {
        padding: theme.spacing(2),
    },
    fileUploadBtn: {
        textTransform: 'initial',
        borderTop: `1px dashed ${theme.palette.action.disabled}`
    },
    wrapperEditor: {
        border: `1px solid ${theme.palette.action.disabled}`
    },
    mdEditor: {
        boxShadow: 'none'
    },
    labelBtn: {
        justifyContent: 'flex-start',
        fontWeight: 'normal'
    }
});
