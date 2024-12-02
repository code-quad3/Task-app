# Task App

A task management application that helps users organize their tasks efficiently and stay productive. Users can create, update, delete, and view tasks. The app ensures accountability by sending email notifications for overdue tasks and provides visual insights into productivity using Chart.js.

## Demo

Check out the live demo of the app: 

https://github.com/user-attachments/assets/8f99cb9b-3639-499c-83e4-46b09a1b332f


## Features

- **Task Management**: Add, update, delete, and read tasks.
- **Deadline Notifications**: Sends email alerts when a task is not completed by the deadline.
- **Visualization**: Tracks progress and productivity using Chart.js.
- **Robust Backend**: Implements message queue with BullMQ to manage the notification system efficiently.

## Tech Stack

### Frontend
- [React](https://reactjs.org/)
- [Material Tailwind](https://www.material-tailwind.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [BullMQ](https://docs.bullmq.io/)
- [Redis](https://redis.io/)
- [MongoDB](https://www.mongodb.com/)

## Installation and Setup

### Prerequisites
Ensure you have the following installed:
- Node.js
- Redis
- MongoDB

### Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/task-app.git
   cd task-app
2. **Frontend Setup**
  ```bash
    cd frontend
    npm install
    npm run dev 
  ``` 

2. **Backend Setup**
  ```bash
    cd frontend
    npm install
    node index.js
   ```

