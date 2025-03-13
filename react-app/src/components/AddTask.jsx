import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const AddTask = () => {
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState(dayjs());

  const handleSubmit = () => {
    if (!task.trim()) return;
    const formattedDeadline = dayjs(deadline).format("YYYY-MM-DD HH:mm");
    //onAddTask({ task, deadline: deadline.toISOString() });
    console.log(task, formattedDeadline)
    setTask("");
    setDeadline(dayjs());
  };

  return (
    <Box display="flex" alignItems="center" gap={2} maxWidth={600} mx="auto" p={2}>
      {/* Task Input */}
      <TextField
        label="New Task"
        variant="outlined"
        fullWidth
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      {/* Date-Time Picker */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Deadline"
          value={deadline}
          onChange={setDeadline}
          slotProps={{ textField: { sx: { minWidth: 220 } } }}
        />
      </LocalizationProvider>

      {/* Add Button */}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Add
      </Button>
    </Box>
  );
};

export default AddTask;