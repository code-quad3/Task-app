import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

function DgNt() {
    const [completed, setCompleted] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Fetch completed tasks data
        const fetchCompletedTasks = async () => {
            try {
                const response = await axios.get('http://localhost:9000/task/completed-tasks-today',{withCredentials: true});
                setCompleted(response.data.completedTasksTodayCount|| 0); // assuming the API returns { completedCount: X }
        
            } catch (error) {
                console.error("Error fetching completed tasks:", error);
            }
        };

        // Fetch total tasks data
        const fetchTotalTasks = async () => {
            try {
                const response = await axios.get('http://localhost:9000/task/total-tasks-today',{withCredentials: true});
                setTotal(response.data.totalTasks|| 0); // assuming the API returns { totalCount: X }
            
            } catch (error) {
                console.error("Error fetching total tasks:", error);
                console.log(response.data);
            }
        };

        fetchCompletedTasks();
        fetchTotalTasks();
    }, []);

    // Calculate non-completed tasks
    const nonCompleted = total - completed;

    const data = {
        labels: ['Completed', 'Yet to be completed'],
        datasets: [
            {
                label: '',
                data: [completed, nonCompleted],
                backgroundColor: [
                    'rgb(60,179,113)',  // Green for completed tasks
                    'rgb(255,99,132)',  // Red for non-completed tasks
                ],
                hoverOffset: 4,
            },
        ],
    };
   
    if(completed === 0 && nonCompleted === 0){
      
      return (<div className="h-42 w-42">
            <p>No tasks today</p>
        </div>);
    }

    return (
        <div className="h-42 w-42">
            <Doughnut data={data} />
        </div>
    );
}

export default DgNt;
