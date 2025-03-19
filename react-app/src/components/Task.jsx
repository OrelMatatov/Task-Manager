import React from "react";
import { Box, Typography, Paper, Tooltip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import TaskStatus from "./TaskStatus";
import { useMutation, useQueryClient } from "@tanstack/react-query"

const Task = ({ task, onEdit }) => {

  const queryClient = useQueryClient();

  const HandleDeleteBtnClick = () => {
      const confirm = window.confirm('Are you sure you want to delete this task?')
      if(!confirm) return;
      mutate();
  }

  const deleteTask = async() => {
    try{
      const answer = await fetch(`/api/tasks/task/${task.task_id}`,{
        method: 'DELETE'
      })

      if (!answer.ok) {
        throw new Error(`Failed to delete task`);
    }
      return await answer.json();
    } 
    catch(err){
      throw new Error(err.error)
    }
    
  }

  const { mutate } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["userTasks"])
    },
    onError: (err) => {
      console.log(err);
    }
  })

  return (
    <Paper
      elevation={2}
      sx={{
        maxWidth: "770px",
        width: "100%",
        mx: "auto",
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* Task Name */}
      <Typography variant="body1" flex={1} sx={{ flex: 1, textAlign: "center", textDecoration: task.status_id === 3 ? "line-through" : "none"}}>
        <strong>Task: </strong> {task.task_name}
      </Typography>

      {/* Status  */}
      <Box display="flex" alignItems="center" gap={1}>
        <TaskStatus status_id={task.status_id} task_id={task.task_id} />
      </Box>

      {/* Due Date */}
      <Typography variant="body2" color="text.secondary">
        Due: {dayjs(task.due_date).format("YYYY-MM-DD HH:mm")}
      </Typography>

      {/* Action Buttons */}
      <Tooltip title="Edit this task">
        <IconButton color="primary" size="small" 
          disabled={task.status_id === 3 ? true : false}
          onClick={() => onEdit(task)}>
          <EditIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete this task">
        <IconButton color="error" size="small" onClick={HandleDeleteBtnClick}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

export default Task;
