import React, { useState } from "react";
import { Box, FormControl, Typography, Select, MenuItem, Checkbox, FormControlLabel, Button } from "@mui/material";
import { useQuery, useQueryClient } from '@tanstack/react-query'
import TasksList from "./TasksList";


const TaskDashboard = ({ userId }) => {
    
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState(null)

    //Sorting states && Functions
    const [sortOption, setSortOption] = useState("")

    const sortTasksByAscDate = () => {
        if(filteredTasks == null){
            setTasks((prevTasks) => {
                return [...prevTasks].sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
            });  
        }
        else{
            setFilteredTasks((prevTasks) => {
                return [...prevTasks].sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
            });  
        }
          
    }

    const sortTasksByDscDate = () => {
        if(filteredTasks == null){
            setTasks((prevTasks) => {
                return [...prevTasks].sort((a, b) => new Date(b.due_date) - new Date(a.due_date));
            })
        }
        else{
            setFilteredTasks((prevTasks) => {
                return [...prevTasks].sort((a, b) => new Date(b.due_date) - new Date(a.due_date));
            })
        }
        
    }

    const handleSortChange = (e) => {
        setSortOption(e.target.value)
        if(e.target.value == "deadlineAsc"){
            sortTasksByAscDate();
        }
        else if(e.target.value == "deadlineDesc"){
            sortTasksByDscDate();
        }

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
        setFilteredTasks((prevFilteredTasks) => 
            (prevFilteredTasks ?? tasks).filter(task => statusFilters[task.status])
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
    };

    const handlefilterDatesBtn = () => {
        /* setShowTasksFilteredByDeadline(true);
        queryClient.invalidateQueries(["userTasks"]) */

        setUserInFilterByDeadlineMode(true);
        filterReleventDates(filteredTasks || data);
    }

    const isDateBetween = (date, startDate, endDate) => {
        const dateObj = new Date(date); 
        const startObj = new Date(startDate);
        const endObj = new Date(endDate); 
    
        return dateObj >= startObj && dateObj <= endObj;
    };

    const getDateAfterWeeks = (weeks) => {
        const date = new Date();
        date.setDate(date.getDate() + weeks * 7); // Add weeks * 7 days
        return date.toISOString().split("T")[0]; // Return date in YYYY-MM-DD format
    };


    const filterReleventDates = (data) => {
        const today = new Date().toISOString().split("T")[0];
        const nextWeek = getDateAfterWeeks(1);
        const twoWeeksFromNow = getDateAfterWeeks(2);
        let filteredData = data.filter((task) => {
            const taskDate = task.due_date.split(" ")[0];
            if(dateFilters["dueToday"]) {
                if(today === taskDate)
                    return true;
            }
            if(dateFilters["dueThisWeek"]){
                if(isDateBetween(taskDate, today, nextWeek))
                    return true;
            }
            if(dateFilters["dueNextWeek"])
                 return isDateBetween(taskDate, nextWeek, twoWeeksFromNow);
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
                             
                //reset the sorted tasks by date
                //clean the code!!!
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
