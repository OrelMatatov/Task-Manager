# Task Management App
A simple task management application that helps users track and manage their tasks with deadlines. This app includes features like task creation, sorting, filtering, and real-time reminders for upcoming deadlines.


## Features
- Add, edit, and delete tasks.
- Set deadlines for tasks.
- Sort tasks by their due dates:
    * ⬆ **Ascending** – Sorts tasks from the earliest to the latest deadline.
    * ⬇ **Descending** – Sorts tasks from the latest to the earliest deadline.
- Filter tasks based on their status:
    * ✅ **Completed** – Shows only finished tasks.
    * 🔄 **In Progress** – Displays tasks that are currently being worked on.
    * ⏳ **Pending** – Lists tasks that are yet to be started.
- Filter tasks based on their due dates:
    * 📅 **Today** – Shows tasks that are due today.
    * 📆 **This Week** – Displays tasks that are due within the current week.
    * 📅 **Next Week** – Lists tasks that are due in the upcoming week.
- 🔄 **Combine filters**: View tasks based on both due date and status (e.g., "Completed tasks due this week")  
- Pop-up notifications for tasks approaching their deadline.
- 🔑 User Authentication:  
    * **Log in** – Allows users to access their tasks securely.
    * **Register** – New users can create an account to start managing tasks.
    * **Secure password storage** – Passwords are stored securely using encryption to ensure user data privacy.


## Tech Stack
- Frontend: React, React Router, Material UI, Day.js
- Backend: Node.js, Express, SQLite


## Installation
- Clone The repo and run **./install.ps1** - It will install all the dependencies and run the project

## Screenshots
Tasks Display
![Tasks Dispay](./react-app/screenshots/screenshot1.png)

Tasks Display With Filtering
![Tasks Display With Filtering](./react-app/screenshots/screenshot2.png)
![Tasks Display With Filtering](./react-app/screenshots/screenshot3.png)

Tasks Displayed in Ascending Order by Deadline
![Tasks Displayed in Ascending Order by Deadline](./react-app/screenshots/screenshot4.png)

Tasks Displayed in Descending Order by Deadline
![Tasks Displayed in Descending Order by Deadline](./react-app/screenshots/screenshot5.png)

Login Page
![Login Page](./react-app/screenshots/screenshot6.png)

Register Page
![Register Page](./react-app/screenshots/screenshot7.png)
