import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function CircularIndeterminate() {
    const theme = createTheme({
        palette: {
            primary: {
            main: '#ffffff',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', color: 'white' }}>
                <CircularProgress size={250} color="primary" thickness={7}/>
            </Box>
        </ThemeProvider>
    );
}