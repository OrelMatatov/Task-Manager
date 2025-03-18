import React from 'react'
import { useLocation } from 'react-router-dom';
import ProfileMenu from '../components/ProfileMenu';
import AddTask from '../components/AddTask';
import TaskDashboard from '../components/TaskDashboard';

const TasksPage = () => {

    const location = useLocation();
    const user = location.state?.user;
    
    if(!user){
        return <div>Please log in to view your tasks</div>
    }

    return (
        <>
        <ProfileMenu user={user}/>
        <AddTask userId={user.user_id}/>
        <TaskDashboard userId={user.user_id} />
       
        {/* <Test userId={user.user_id} />    */}     
 </>
    )
}

export default TasksPage