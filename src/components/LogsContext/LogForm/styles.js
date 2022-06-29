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
    },
    labelsDivider: {
        margin: '20px 0'
    },
    labelChip: {
        margin: theme.spacing(0.5),
        color: 'white'
    }
});
