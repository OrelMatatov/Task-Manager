import React, { useState, useEffect } from "react";
import { Select, MenuItem, Button, Box, Chip, Checkbox, FormControlLabel, Typography, FormControl, Tooltip  } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from '@tanstack/react-query'
import TasksList from "./TasksList";
import NoDataMessage from "./NoDataMessage";
import CompletedTasksTracker from "./CompletedTasksTracker";

const TaskDashboard = ({ userId }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedDeadlines, setSelectedDeadlines] = useState([]);

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState(null)

  const [sortOption, setSortOption] = useState("")

  const [completedTasks, setCompletedTasks] = useState(0)

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
 

  const fetchStatuses = async () => {
    try {
      const response = await fetch("api/tasks/statuses");
      if (!response.ok) throw new Error("Cannot get statuses");

      const statuses = await response.json();
      setStatuses(statuses);
    } catch (err) {
      console.log("Failed to fetch statuses:", err);
    }
  };

  const handleSelectFilter = (event) => {
    const value = event.target.value;
    if (!selectedFilters.includes(value)) {
      setSelectedFilters([...selectedFilters, value]);
    }
    if (value === "Status" && statuses.length === 0) {
      fetchStatuses();
    }
  };

  const handleRemoveFilter = (option) => {
    if(option === "Status"){
        setSelectedStatuses([]);
        if(selectedDeadlines.length > 0)
            setFilteredTasks(filterReleventDates(tasks))
        else
            setFilteredTasks(null);
    }
    else if(option === "Dates"){
        setSelectedDeadlines([]);
        if(selectedStatuses.length > 0)
            setFilteredTasks(tasks.filter(task => selectedStatuses.includes(task.status)));
        else
            setFilteredTasks(null);
    }
    setSelectedFilters(selectedFilters.filter((item) => item !== option));
  };

  const handleStatusCheckboxChange = (e) => {
    const value = e.target.value;
    setSelectedStatuses((prev) => {
        if (prev.includes(value)) {
            // If the value is already in the array, remove it
            return prev.filter((status) => status !== value);
        } else {
            // If the value is not in the array, add it
            return [...prev, value];
        }
    })
  }

  const handleDeadlineCheckboxChange = (e) => {
    const value = e.target.value;
    setSelectedDeadlines((prev) => {
        if (prev.includes(value)) {
            // If the value is already in the array, remove it
            return prev.filter((status) => status !== value);
        } else {
            // If the value is not in the array, add it
            return [...prev, value];
        }
    })
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
        if(selectedDeadlines.includes("dueToday")){
            if(today === taskDeadline) return true; 
        }
        if(selectedDeadlines.includes("dueThisWeek")){
            if(isDateBetween(taskDeadline, today, endOfThisWeek)) return true;
        }

        if(selectedDeadlines.includes("dueNextWeek")){
            const startOfNextWeek = getEndOfWeek(0, 1);
            return isDateBetween(taskDeadline,startOfNextWeek, endOfNextWeek);
        }
    })
    return filteredData;
}

  const filterTasks = (tasks) => {
    let filteredTasks = tasks;
    
    //If filtering by status only
    if(selectedStatuses.length > 0 && selectedDeadlines.length === 0){
        filteredTasks = tasks.filter(task => selectedStatuses.includes(task.status));
    }

    //If filtering by deadline only
    if (selectedDeadlines.length > 0 && selectedStatuses.length === 0) {
        filteredTasks = filterReleventDates(tasks);
    }

    // If filtering by both status and deadline
    if (selectedStatuses.length > 0 && selectedDeadlines.length > 0) {
        filteredTasks = filterReleventDates(tasks.filter(task => selectedStatuses.includes(task.status)));
    }
    
    setFilteredTasks(filteredTasks)
    
  }



  const fetchUserTasks = async() => {
    try{
        const response = await fetch(`/api/tasks/userTasks/${userId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        
        if(filteredTasks !== null)
            filterTasks(data)
        
        setCompletedTasks(data.filter(task => task.status === "Completed").length);
        setTasks(data)
        return data
    }

    catch(err){
        throw new Error(`Failed to fetch user tasks: ${err.error}`);
    }
  }

  const {data, isLoading, error} = useQuery({
    queryKey: ["userTasks"], 
    queryFn: fetchUserTasks
    })

  if(error) return <NoDataMessage message="Something Went Wrong" />

  return (
    <>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2, marginRight: 15}}>
            <Typography variant="h6" sx={{  marginRight:1 }}>Sort By:</Typography>
                <FormControl sx={{ width: "220px" }}>
                <Select value={sortOption} onChange={handleSortChange} displayEmpty>
                    <MenuItem value="" disabled>Select an option</MenuItem>
                    <MenuItem value="deadlineAsc">Deadline (Ascending)</MenuItem>
                    <MenuItem value="deadlineDesc">Deadline (Descending)</MenuItem>
                </Select>
                </FormControl>
            

            <Typography variant="h6" sx={{ marginRight: 1, marginLeft: 5 }}>Filter By:</Typography>
                <FormControl sx={{ width: '220px' }}> 
                <Select
                    value=""
                    onChange={handleSelectFilter}
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select an option</MenuItem>
                    <MenuItem value="Status">Status</MenuItem>
                    <MenuItem value="Dates">Due To...</MenuItem>
                </Select>
                </FormControl>
        </Box>

        <Box sx={{ 
            width: 500, 
            display: "flex", 
            flexDirection: "column", 
            gap: 2, 
            alignItems: "center", 
            justifyContent: "center",
            margin: "0 auto"
            }}>

            {/* Status Section */}
            {selectedFilters.includes("Status") && statuses.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 2, justifyContent: "center" }}>
                {statuses.map((status) => (
                    <FormControlLabel
                    key={status.status_id}
                    control={<Checkbox 
                        checked={selectedStatuses.includes(status.status_name)}
                        onChange={handleStatusCheckboxChange}
                        value={status.status_name}
                    />}
                    label={status.status_name}
                    sx={{ marginRight: 1 }}
                    />
                ))}
                <Tooltip title="Remove the filter for status" arrow>
                <Chip
                    label="Status"
                    onDelete={() => handleRemoveFilter("Status")}
                    deleteIcon={<CloseIcon />}
                    sx={{ marginTop: 1 }}
                />
                </Tooltip>
            </Box>
            )}

            {selectedFilters.includes("Dates") && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
                {["dueToday", "dueThisWeek", "dueNextWeek"].map((deadline, index) => (
                    <FormControlLabel
                    key={index}
                    control={<Checkbox
                        checked={selectedDeadlines.includes(deadline)}
                        onChange={handleDeadlineCheckboxChange}
                        value={deadline}
                        />}
                    label={
                        deadline === "dueToday"
                        ? "Today"
                        : deadline === "dueThisWeek"
                        ? "This Week"
                        : "Next Week"
                    }
                    sx={{ marginRight: 1 }}
                    />
                ))}
                <Tooltip title="Remove the filter for dates" arrow>
                <Chip
                    label="Due To.."
                    onDelete={() => handleRemoveFilter("Dates")}
                    deleteIcon={<CloseIcon />}
                    sx={{ marginTop: 1 }}
                />
                </Tooltip>
            </Box>
            )}

            {selectedFilters.length > 0 && (
                <Button 
                variant="contained" 
                onClick={() => filterTasks(tasks)} 
                sx={{ width: '150px', alignSelf: "center" }}
                >
                Filter
                </Button>
            )}
        </Box>

        <CompletedTasksTracker completedTasks={completedTasks} totalTasks={tasks.length} />

        {filteredTasks !== null && filteredTasks.length === 0 ? (
            <NoDataMessage message="No results found for these filters." />
            ) : tasks.length === 0 ? (
                <NoDataMessage message="No Tasks Yet." />
            ) : (
            <TasksList data={filteredTasks || tasks} isLoading={isLoading} /> 
        )}
    </>
  );
};

export default TaskDashboard;
