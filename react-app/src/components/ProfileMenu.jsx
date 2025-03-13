import React, { useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem, Avatar } from "@mui/material";

const ProfileMenu = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ p: 2 }}>

      <IconButton onMouseEnter={handleMenuOpen} size="small">
            <Avatar src={user.avatar} />
      </IconButton>

      <Typography variant="h6">Hello, {user.first_name} 👋</Typography>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onMouseLeave={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Disconnect</MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileMenu;