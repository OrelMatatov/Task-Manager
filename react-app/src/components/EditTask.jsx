import React, { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const EditTask = ({ task, onClose }) => {
    const [taskName, setTaskName] = useState(task.task_name);
    const [deadline, setDeadline] = useState(""); 
    const queryClient = useQueryClient();

     useEffect(() => {
        if (task.due_date) {
            const formattedDate = dayjs(task.due_date, "YYYY-MM-DD HH:mm").format("YYYY-MM-DDTHH:mm");
            setDeadline(formattedDate); 
        }
    }, [task]); 

    const editTask = async(updatedTask) => {
        try{
            const answer = await fetch(`/api/tasks/task/${task.task_id}`,{
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updatedTask)
            })
      
            if(!answer.ok){
              throw new Error("Failed to edit task");
            }
            return await answer.json();
        }
        catch(err){
        throw new Error(err.error);
        }
          
    }

    const handleSave = () => {
        mutate({
            task_name: taskName,
            due_date: deadline
        })
        onClose();
    };

    const { mutate } = useMutation({
        mutationFn: editTask,
        onSuccess: () => {
          queryClient.invalidateQueries(["userTasks"])
        },
        onError: (err) => {
          console.log(err);
        }
    })
    

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={2}
            p={2}
        >
            <TextField
                label="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                fullWidth
            />

            {/* Compact Date-Time Picker */}
            <TextField
                label="Deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                fullWidth
            />

            <Box display="flex" justifyContent="center" gap={3}>
                <Button variant="contained" color="primary" onClick={handleSave} sx={{ minWidth: 120 }}>
                    Save
                </Button>

                <Button variant="contained" color="error" onClick={onClose} sx={{ minWidth: 120 }}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default EditTask;
