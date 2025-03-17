import React, { useState } from "react";
import { Box, FormControl, Typography, Select, MenuItem, Checkbox, FormControlLabel, Button } from "@mui/material";
import { useQuery, useQueryClient } from '@tanstack/react-query'
import TasksList from "./TasksList";


const TaskDashboard = ({ userId }) => {
    
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState(null)

    //Sorting states && Functions
    const [sortOption, setSortOption] = useState("")

    const sortTasks = (order) => {
        const sortedTasks = [...(filteredTasks ?? tasks)].sort((a, b) => 
            order === "asc" ? new Date(a.due_date) - new Date(b.due_date) : new Date(b.due_date) - new Date(a.due_date)
        );
        filteredTasks ? setFilteredTasks(sortedTasks) : setTasks(sortedTasks);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value)
        if (e.target.value === "deadlineAsc") sortTasks("asc");
        else if (e.target.value === "deadlineDesc") sortTasks("desc");

    };

    // ----------------------------------------------------------------------

    //states of Task Filter on status & its functions
    const [filterOption, setFilterOption] = useState("")
    const [statusOptions, setStatusOptions] = useState([]);
    const [statusFilters, setStatusFilters] = useState({}); // Store checkbox states 
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [userInFilterByStatusMode, setUserInFilterByStatusMode] = useState(false)

    const fetchStatusesAndInitTheirCheckboxState = async() => {
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


    const handleStatusCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setStatusFilters({
            ...statusFilters,
            [name]: checked,
        });
    
    };

    const handleCancelOnFilterStatus = () => {
        setShowStatusFilter(false);
        setUserInFilterByStatusMode(false);     
        setFilterOption("");
        // Reset checkboxes
        setStatusFilters((prev) =>
            Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {})
        );
        setFilteredTasks(null) 
    };

    const filterTasksByStatus = () => {
        setUserInFilterByStatusMode(true);
        setFilteredTasks(
            tasks.filter(task => statusFilters[task.status])
        );
        
    };
    
    // ----------------------------------------------------------------------

    //states of Task Filter by dates & its functions
    const [dateFilters, setDateFilters] = useState({
        dueToday: false,
        dueThisWeek: false,
        dueNextWeek: false,
    });
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [userInFilterByDeadlineMode, setUserInFilterByDeadlineMode] = useState(false);

    const handleDeadlineCheckboxChange = (event) => {
        setDateFilters({
            ...dateFilters,
            [event.target.name]: event.target.checked
        });
    };
    

    const handleCancelOnDeadlineFilter = () => {
        setShowDateFilter(false);
        setUserInFilterByDeadlineMode(false)
        setFilterOption("");
        setDateFilters({ dueToday: false, dueThisWeek: false, dueNextWeek: false });
        setFilteredTasks(null)
    };

    const handlefilterDatesBtn = () => {
        setUserInFilterByDeadlineMode(true);
        filterReleventDates(tasks);
    }

    const isDateBetween = (date, startDate, endDate) => {
        const dateObj = new Date(date); 
        const startObj = new Date(startDate);
        const endObj = new Date(endDate); 
    
        return dateObj >= startObj && dateObj <= endObj;
    };

    const getEndOfWeek = (weeksJump, addDays = 0) => {
        const date = new Date();
        const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
        const daysUntilSaturday = 6 - dayOfWeek;
        
        date.setDate(date.getDate() + daysUntilSaturday + 7 * weeksJump + addDays);
        return date.toISOString().split("T")[0];
    };

    const filterReleventDates = (data) => {

        let filteredData = data.filter((task) => {
            const taskDeadline = task.due_date.split(" ")[0];
            const today = new Date().toISOString().split("T")[0];
            const endOfThisWeek = getEndOfWeek(0); // 0 means this week
            const endOfNextWeek = getEndOfWeek(1); // 1 means next week
            if(dateFilters["dueToday"]){
                if(today === taskDeadline) return true; 
            }
            if(dateFilters["dueThisWeek"]){
                if(isDateBetween(taskDeadline, today, endOfThisWeek)) return true;
            }

            if(dateFilters["dueNextWeek"]){
                const startOfNextWeek = getEndOfWeek(0, 1);
                return isDateBetween(taskDeadline,startOfNextWeek, endOfNextWeek);
            }
        })
        setFilteredTasks(filteredData);
    }


    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
        setShowStatusFilter(event.target.value === "status");
        setShowDateFilter(event.target.value === "dates")
        if(event.target.value === "status"){   
            fetchStatusesAndInitTheirCheckboxState();
        }
    };

    const fetchUserTasks = async() => {
        try{
            const response = await fetch(`/api/tasks/userTasks/${userId}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setTasks(data)
            if(filteredTasks != null){
                //TODO                
                //User in filter mode - add to filtered data as well
                if(userInFilterByStatusMode){
                    setFilteredTasks(() => {
                        return data.filter((task) => {
                            return statusFilters[task.status]; 
                        });
                    });   
                }

                if(userInFilterByDeadlineMode){
                    filterReleventDates(filteredData)
                }
                             
            }
            return data;
        }
        catch(err){
            throw new Error(`Failed to fetch user tasks: ${err.error}`);
        }
        
    }
    
    const {data, isLoading, error} = useQuery({
        queryKey: ["userTasks"], 
        queryFn: fetchUserTasks
        })

    
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
                                onChange={handleStatusCheckboxChange}
                                name={status.status_name}
                            />
                        }
                        label={status.status_name}
                        />
                    ))}
                    <Button variant="contained" color="primary" onClick={filterTasksByStatus}>Filter</Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancelOnFilterStatus}>Cancel</Button>
                </Box>
            )}
   
            {showDateFilter && (
                <Box display="flex" alignItems="center" gap={2} mt={2}>
                    {["dueToday", "dueThisWeek", "dueNextWeek"].map((filterKey) => (
                        <FormControlLabel
                            key={filterKey}
                            control={
                                <Checkbox
                                    checked={dateFilters[filterKey]}
                                    onChange={handleDeadlineCheckboxChange}
                                    name={filterKey}
                                />
                            }
                            label={
                                filterKey === "dueToday" ? "Due Today" :
                                filterKey === "dueThisWeek" ? "Due This Week" :
                                "Due Next Week"
                            }
                        />
                    ))}
                    <Button variant="contained" color="primary" onClick={handlefilterDatesBtn}>Filter</Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancelOnDeadlineFilter}>Cancel</Button>
                </Box>
            )}

        </Box>
            
        <TasksList data={filteredTasks || tasks} isLoading={isLoading} />

        
        </>
    );
};

export default TaskDashboard;
