import React, { useRef } from 'react';
import {
    Button
} from '@mui/material';

export const ButtonWithFileInput = ({ children, onChange }) => {
    const ref = useRef();
    return (
        <Button variant={'outlined'} color={'primary'}
            onClick={() => ref.current.click()}
        >
            <input
                type="file"
                ref={ref}
                onChange={(e) => onChange(e)}
                hidden
            />
            {children}
        </Button>
    )
}

