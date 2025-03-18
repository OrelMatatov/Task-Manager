import React, { useState, useEffect } from "react";
import { Snackbar, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";

const TaskReminder = ({ tasks }) => {
  const [open, setOpen] = useState(false);
  const [approachingTask, setApproachingTask] = useState(null);

  useEffect(() => {
    const checkDeadlines = () => {
      const now = dayjs();
      const upcomingTask = tasks.find(task => 
        dayjs(task.due_date).diff(now, "minutes") <= 5 && dayjs(task.due_date).diff(now, "minutes") > 0
      );

      if (upcomingTask) {
        setApproachingTask(upcomingTask);
        setOpen(true);
      }
    };

    const interval = setInterval(checkDeadlines, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <Snackbar 
      open={open} 
      onClose={() => setOpen(false)} 
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert 
        severity="warning" 
        sx={{ width: "100%" }} 
        action={
          <IconButton size="small" color="inherit" onClick={() => setOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        ⏳ Task "{approachingTask?.task_name}" is due in less than 5 minutes!
      </Alert>
    </Snackbar>
  );
};

export default TaskReminder;
