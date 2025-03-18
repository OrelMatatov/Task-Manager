import React from 'react';
import { Box, Typography } from "@mui/material";

const CompletedTasksTracker = ({ completedTasks, totalTasks }) => {
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const getStatus = () => {
        if (percentage === 100) return { text: 'All tasks completed! 🎉', color: '#4CAF50' };
        if (percentage > 50) return { text: `${Math.round(percentage)}% completed! Keep going!`, color: '#FF9800' };
        return { text: `${Math.round(percentage)}% done`, color: '#F44336' };
    };

    const { text, color } = getStatus();

    return (
        <Box 
            display="flex" 
            flexDirection="row" 
            justifyContent="center" 
            alignItems="center" 
            mt={3} 
            width="95%"
        >
            <Typography variant="h6" mr={3}>
                Completed Tasks: {completedTasks} / {totalTasks}
            </Typography>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                px={3}
                py={1}
                borderRadius="50px"
                bgcolor={color}
                color="white"
                fontWeight="bold"
                sx={{ textTransform: 'uppercase', fontSize: '14px' }}
            >
                {text}
            </Box>
        </Box>
    );
};

export default CompletedTasksTracker;
