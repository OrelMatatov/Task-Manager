import React, { useState } from "react";
import { Box, FormControl, Typography, Select, MenuItem, Checkbox, FormControlLabel, Button } from "@mui/material";
import { useQuery, useQueryClient } from '@tanstack/react-query'
import TasksList from "./TasksList";


const TaskDashboard = ({ userId }) => {
    const [sortOption, setSortOption] = useState("")
    const [showSortedTasksAscDate, setShowSortedTasksAscDate] = useState(false);
    const [showSortedTasksDscDate, setShowSortedTasksDscDate] = useState(false);

    const [filterOption, setFilterOption] = useState("")
    const [statusOptions, setStatusOptions] = useState([]);
    const [statusFilters, setStatusFilters] = useState({}); // Store checkbox states 
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [showTasksFilteredByStatus, setShowTasksFilteredByStatus] = useState(false);

    const queryClient = useQueryClient();
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

            let filteredData = [...data];

            // Filter tasks by selected status
            if (showTasksFilteredByStatus) {
                filteredData = filteredData.filter((task) => {
                    return statusFilters[task.status]; 
                });
            }
            return filteredData;
        }
        catch(err){
            throw new Error(`Failed to fetch user tasks: ${err.error}`);
        }
        
    }
    
    const {data, isLoading, error} = useQuery({
        queryKey: ["userTasks", showSortedTasksAscDate, showSortedTasksDscDate, showTasksFilteredByStatus], 
        queryFn: fetchUserTasks
    })


    const handleFilterChange = async(event) => {
        setFilterOption(event.target.value);
        setShowStatusFilter(event.target.value === "status");
        if(event.target.value === "status"){   
            if(statusOptions.length === 0){
                try{
                    const response = await fetch('api/tasks/statuses');
                    if(!response.ok)
                        throw new Error("Cannot get statuses")

                    const statuses = await response.json();
                    
                    // Convert statuses into an object for tracking checkbox states
                    const statusState = statuses.reduce((acc, status) => {
                        acc[status.status_name] = false; // Initially, all statuses are unchecked
                        return acc;
                    }, {});

                    setStatusOptions(statuses);
                    setStatusFilters(statusState);
                }
                catch(err){
                    console.log("Failed to fetch statuses:", err)
                }
                
            }
            
        }
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setStatusFilters({
            ...statusFilters,
            [name]: checked,
        });
    
    };

    const handleCancel = () => {
        setShowStatusFilter(false);
        setFilterOption("");
        // Reset checkboxes
        setStatusFilters((prev) =>
            Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {})
        );
        setShowTasksFilteredByStatus(false);        
    };

    const filterTasks = () => {
        setShowTasksFilteredByStatus(true);        
        queryClient.invalidateQueries(["userTasks"])        
    }
    
    return (
        <>
        <Box display="flex" flexDirection="column" alignItems="center" p={2}>
            <Box display="flex" alignItems="center" gap={3}>
                <Typography variant="body1">Sort By:</Typography>
                <FormControl sx={{ width: '220px' }}>
                    <Select value={sortOption} onChange={handleSortChange} displayEmpty>
                        <MenuItem value="" disabled>Select an option</MenuItem>
                        <MenuItem value="deadlineAsc">Deadline (Ascending)</MenuItem>
                        <MenuItem value="deadlineDesc">Deadline (Descending)</MenuItem>
                    </Select>
                </FormControl>

                <Typography variant="body1">Filter By:</Typography>
                <FormControl sx={{ width: '220px' }}>
                    <Select value={filterOption} onChange={handleFilterChange} displayEmpty>
                        <MenuItem value="" disabled>Select an option</MenuItem>
                        <MenuItem value="status">Status</MenuItem>
                        <MenuItem value="dates">Dates</MenuItem>
                    </Select>
                </FormControl>
            </Box>


            
            {showStatusFilter && (
                <Box display="flex" alignItems="center" gap={2} mt={2}>
                    {statusOptions.map((status, index) => (
                        <FormControlLabel
                        key={index}
                        control={
                            <Checkbox
                                checked={statusFilters[status.status_name]}
                                onChange={handleCheckboxChange}
                                name={status.status_name}
                            />
                        }
                        label={status.status_name}
                        />
                    ))}
                    <Button variant="contained" color="primary" onClick={filterTasks}>Filter</Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>Cancel</Button>
                </Box>
            )}
   
        </Box>
            
        <TasksList data={data} isLoading={isLoading}/>

        
        </>
    );
};

export default TaskDashboard;
