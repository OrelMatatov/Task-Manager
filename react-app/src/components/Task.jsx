import React from "react";
import { Box, Typography, Paper, Tooltip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import TaskStatus from "./TaskStatus";

const Task = ({ task }) => {
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

      {/* Status with Edit Icon */}
      <Box display="flex" alignItems="center" gap={1}>
        <TaskStatus status_id={task.status_id} task_id={task.task_id} />
      </Box>

      {/* Due Date */}
      <Typography variant="body2" color="text.secondary">
        Due: {dayjs(task.due_date).format("YYYY-MM-DD HH:mm")}
      </Typography>

      {/* Action Buttons - Icons */}
      <Tooltip title="Edit this task">
        <IconButton color="primary" size="small" disabled={task.status_id === 3 ? true : false}>
          <EditIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete this task">
        <IconButton color="error" size="small">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

export default Task;
