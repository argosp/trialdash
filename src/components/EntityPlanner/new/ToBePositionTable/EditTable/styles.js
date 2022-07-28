export const styles = (theme) => ({
    root: {
        height: '100%',
        width: 650,
        backgroundColor: '#fefefe',
        position: 'absolute',
        top: 0,
        left: '100%',
        zIndex: 1000
    },
    editTable:
    {
        display: 'flex',
        flexDirection: 'column',
        outline: '1px solid #E0E0E0',
        width: 50
    },
    tool: {
        backgroundColor: theme.palette.white.main,
        boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.04), 0px 20px 25px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'row',
        marginTop: 6,
        height: '100%',
        gap: 5,
        '& .toolItem': {
            display: 'flex',
            justifyContent: 'space-around',
            '& > *': {
                width: '40%'
            }
        },

    },
    toolBoxContainer: {
        backgroundColor: theme.palette.white.main,
        minWidth: 250,
        minHeight: `calc(100% + 20px)`,
    },
    toolBoxItem: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    cloneTrialsContainer: {
        padding: '6px 8px',
        display: 'flex',
        '&>*': {
            flex: 1
        }

    },
    cloneTrialsCol: {
        flex: .5
    },
    cloneTrialsRow: {
        justifyContent: 'space-between',
        backgroundColor: theme.palette.background.default,
        minWidth: '250px',
        borderBottom: '1px solid #E0E0E0'
    },

})