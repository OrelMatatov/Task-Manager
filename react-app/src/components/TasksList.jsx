import React, {useState} from 'react'
import { useQuery } from '@tanstack/react-query'
import Task from "./Task";
import { Box, Dialog, DialogTitle, DialogContent } from "@mui/material";
import EditTask from './EditTask';

const TasksList = ({ data, isLoading}) => {

    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleOpenEdit = (task) => {
        setSelectedTask(task);  // Store selected task
        setOpen(true);  // Open dialog
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedTask(null); // Reset selection
    };



    if(isLoading) return <p>Loading...</p>

    return (
        <>
        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.map((task, index) => (
                <Task key={task.task_id || index} task={task} onEdit={handleOpenEdit}/>
            ))}
        </Box>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent>
                {selectedTask && <EditTask task={selectedTask} onClose={handleClose} />}
            </DialogContent>
        </Dialog> 
        </>
    )
}

export default TasksList