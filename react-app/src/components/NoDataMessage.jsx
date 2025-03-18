import React from 'react'
import { Box, Typography } from "@mui/material";

const NoDataMessage = ({message}) => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%" mt={5}>
          <Typography variant="h6" color="textSecondary">
            {message}
          </Typography>
        </Box>
      );
}

export default NoDataMessage