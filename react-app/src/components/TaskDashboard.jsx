import React, { useState } from "react";
import { Box, FormControl, Typography, Select, MenuItem} from "@mui/material";

const TaskDashboard = () => {
    const [sortOption, setSortOption] = useState("");

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };


    return (
        <Box display="flex" alignItems="center" gap={2} p={1}>
            {/* Label without 'By' in a new line */}
            <Typography variant="body1">Sort By</Typography>

            <FormControl sx={{ width: '220px' }}>
                <Select
                    value={sortOption}
                    onChange={handleSortChange}
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select an option</MenuItem>
                    <MenuItem value="deadlineAsc">Deadline (Ascending)</MenuItem>
                    <MenuItem value="deadlineDesc">Deadline (Descending)</MenuItem>
                </Select>
            </FormControl>
        </Box>


    );
};

export default TaskDashboard;
