import React, { useState } from "react";
import { Box, FormControl, Typography, Select, MenuItem, Checkbox, FormControlLabel, Button } from "@mui/material";
import { useQuery } from '@tanstack/react-query'
import TasksList from "./TasksList";


const TaskDashboard = ({ userId }) => {
    const [sortOption, setSortOption] = useState("")
    const [showSortedTasksAscDate, setShowSortedTasksAscDate] = useState(false);
    const [showSortedTasksDscDate, setShowSortedTasksDscDate] = useState(false);
    const handleSortChange = (e) => {
        setSortOption(e.target.value)
        setShowSortedTasksAscDate(e.target.value === "deadlineAsc")
        setShowSortedTasksDscDate(e.target.value === "deadlineDesc");
    };

    const fetchUserTasks = async() => {
        try{
            const response = await fetch(`/api/tasks/userTasks/${userId}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();

            if(showSortedTasksAscDate){
                data.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
            }

            else if(showSortedTasksDscDate){
                data.sort((a, b) => new Date(b.due_date) - new Date(a.due_date));
            }
            
            return data;
        }
        catch(err){
            throw new Error(`Failed to fetch user tasks: ${err.error}`);
        }
        
    }
    
    const {data, isLoading, error} = useQuery({
        queryKey: ["userTasks", showSortedTasksAscDate, showSortedTasksDscDate], 
        queryFn: fetchUserTasks,
        staleTime: 5000
    })


    
    return (
        <>
        <Box display="flex" flexDirection="column" alignItems="center" p={2}>
            <Box display="flex" alignItems="center" gap={3}>
                <Typography variant="body1">Sort By</Typography>
                <FormControl sx={{ width: '220px' }}>
                    <Select value={sortOption} onChange={handleSortChange} displayEmpty>
                        <MenuItem value="" disabled>Select an option</MenuItem>
                        <MenuItem value="deadlineAsc">Deadline (Ascending)</MenuItem>
                        <MenuItem value="deadlineDesc">Deadline (Descending)</MenuItem>
                    </Select>
                </FormControl>


            </Box>

                    
        </Box>
        
        <TasksList data={data} isLoading={isLoading}/>
        </>
    );
};

export default TaskDashboard;
