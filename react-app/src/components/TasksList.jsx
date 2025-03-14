import React from 'react'
import { useQuery } from '@tanstack/react-query'
import Task from "./Task";
import { Box, Typography, Stack } from "@mui/material";

const TasksList = ({ userId }) => {

    const fetchUserTasks = async() => {
        try{
            const response = await fetch(`/api/tasks/userTasks/${userId}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        }
        catch(err){
            throw new Error(`Failed to fetch user tasks: ${err.error}`);
        }
        
    }

    const {data, isLoading, error} = useQuery({
        queryKey: ["userTasks"], 
        queryFn: fetchUserTasks,
        staleTime: 5000
    })

    if(isLoading) return <p>Loading...</p>

    return (
        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.map((task, index) => (
                <Task key={task.id || index} task={task} />
            ))}
        </Box>
    )
}

export default TasksList