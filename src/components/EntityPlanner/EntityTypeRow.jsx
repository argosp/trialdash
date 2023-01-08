import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { VisibilityOffOutlined, VisibilityOutlined} from '@material-ui/icons'

export const EntityTypeRow = ({entity, isVisible, setIsVisible}) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Typography>
            <Box sx={{fontWeight: 600}}>
            {entity.name}
            </Box>
        </Typography>
        <IconButton onClick={() => setIsVisible(!isVisible)}>
            {
                !!isVisible?
                <VisibilityOutlined />
                :
                <VisibilityOffOutlined />
            }
        </IconButton>

    </div>
  )
}