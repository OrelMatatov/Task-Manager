import React, { useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import {Navigate, useNavigate} from "react-router-dom"

const ProfileMenu = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (option) => {
    setAnchorEl(null);
    switch(option){
      case "Profile":
        navigate('/user', {state: {user}})
        break
      case "Disconnect":
        navigate('/login')
        break
    }

  };  

  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ p: 2 }}>

      <IconButton onMouseEnter={handleMenuOpen} size="small">
            <Avatar />
      </IconButton>

      <Typography variant="h6">Hello, {user.first_name} 👋</Typography>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onMouseLeave={handleMenuClose}
      >

        <MenuItem onClick={() => handleMenuClose("Profile")}>My Profile</MenuItem>
        <MenuItem onClick={() => handleMenuClose("Disconnect")}>Disconnect</MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileMenu;