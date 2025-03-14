import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddTask = ({ userId }) => {
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState(dayjs());
  const queryClient = useQueryClient();

  const createTask = async(newTask) => {
    try{
      const answer = await fetch('/api/tasks',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      })

      if(!answer.ok){
        throw new Error("Failed to add task");
      }
      return await answer.json();
    }
    catch(err){
      throw new Error(err.error);
    }
    

  }

  const { mutate } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["userTasks"])
    },
    onError: (err) => {
      console.log(err);
    }
  })

  const handleSubmit = () => {
    if (!task.trim()) return;
    const formattedDeadline = dayjs(deadline).format("YYYY-MM-DD HH:mm");
    mutate({
      user_id: userId,
      task_name: task,
      due_date: formattedDeadline 
    })
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