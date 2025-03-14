import React from 'react'
import { useLocation } from 'react-router-dom';
import ProfileMenu from '../components/ProfileMenu';
import AddTask from '../components/AddTask';
import TasksList from '../components/TasksList';
const TasksPage = () => {

    const location = useLocation();
    const user = location.state?.user;
    
    if(!user){
        return <div>Please log in to view your tasks</div>
    }

    return (
        <>
        <ProfileMenu user={user}/>
        <AddTask />
        <TasksList userId={user.user_id} />
        </>
    )
}

export default TasksPage