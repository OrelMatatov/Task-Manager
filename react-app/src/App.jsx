import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import LoginPage, {loginAction} from './pages/LoginPage';
import RegisterPage, {registerAction} from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import UserProfilePage from './pages/UserProfilePage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  }, 
  {
    path: "/login",
    element: <LoginPage />,
    action: loginAction
  }, 
  {
    path: "/register",
    element: <RegisterPage />,
    action: registerAction
  },
  {
    path: "/tasks",
    element: <TasksPage />
  },
  {
    path: "/user",
    element: <UserProfilePage />
  }
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App