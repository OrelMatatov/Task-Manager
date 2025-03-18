import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button } from "@mui/material";

const UserProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;
  
    if (!user) {
        return <div>No user data available</div>;
    }
    
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      p={3}
    >
      <Paper elevation={3} sx={{ padding: 3, maxWidth: 400, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          User Profile
        </Typography>

        <Typography variant="h6">
          <strong>First Name:</strong> {user.first_name}
        </Typography>
        <Typography variant="h6">
          <strong>Last Name:</strong> {user.last_name}
        </Typography>
        <Typography variant="h6">
          <strong>Email:</strong> {user.email}
        </Typography>

        {/* Go Back Button */}
        <Box mt={2}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => navigate(`/tasks`, { state: { user } })}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserProfilePage;
