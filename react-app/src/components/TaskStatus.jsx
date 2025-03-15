import React, { useEffect, useState } from "react";
import { IconButton, Select, MenuItem, Typography, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const TaskStatus = ({ status_id, task_id }) => {
    const [statusId, setStatusId] = useState(status_id);
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();


    const fetchStatuses = async() => {
      try{
        const response = await fetch('/api/tasks/statuses');
        if(!response.ok){
          throw new Error(`Error fetching satatuses`);
        }
        const data = await response.json();
        return data;
      } 
      catch(err){
        throw new Error(`Failed to fetch statuses: ${err.error}`)
      }
      
    }

    const {data} = useQuery({queryKey: ["statuses"], queryFn: fetchStatuses})
    

    const changeStatus = async(newStatusId) => {
      try{
        const answer = await fetch(`/api/tasks/task/${task_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({status_id: newStatusId})
        })
        if(!answer.ok){
          throw new Error("Failed to change task status")
        }
        return await answer.json();
      }
      catch(err){
        throw new Error(err.error);
      }
      
  }

    const { mutate } = useMutation({
      mutationFn: changeStatus,
      onSuccess: () => {
        queryClient.invalidateQueries("userTasks")
      }
    })
    

    const handleEditStatusClick = async(e) => {
      const newStatusId = e.target.value;      
      mutate(newStatusId);
      setStatusId(e.target.value);        
      setIsEditing(false);
    }

    
   
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isEditing ? (
            <Select
              value={statusId}
              onChange={handleEditStatusClick}
              size="small"
              autoFocus
              onBlur={() => setIsEditing(false)}
            >
              {data?.map((status, index) => (
                <MenuItem key={index} value={status.status_id}>{status.status_name}</MenuItem>
              ))}

            </Select>
          ) : (
            <Typography variant="body1" sx={{ cursor: "pointer", color: statusId === 3 ? "green" :"warning.main" }}>
              {data ? data.find(status => status.status_id === statusId)?.status_name || "Unknown" : "Loading..."}
            </Typography>

          )}
            
            <Tooltip title="Update Task Status">
                <IconButton size="small" onClick={() => setIsEditing(true)}>
                    <EditIcon fontSize="small" />
                </IconButton>
            </Tooltip>
           
        </div>


      );
}

export default TaskStatus