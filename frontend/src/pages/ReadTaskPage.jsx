import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Typography } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import axios from "axios";


function formatToHumanReadable(dateString) {
    const date = new Date(dateString);

    // Format options
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    return date.toLocaleString(undefined, options);
}









function ReadTaskPage({apiUrl}) {
    const [task, setTask] = useState({});
    const { taskId } = useParams();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`${apiUrl}/${taskId}`, { withCredentials: true });
                setTask(response.data);
                console.log(response.data);
            } catch (error) {
                if(error.status ===409 || error.status === 411){
                    window.location.href ='http://localhost:5173/auth';
                }
                console.error("Error fetching task:", error);
            }
        };

        fetchTask();
    }, [taskId]);

    return (
        <Header>
            <div className="text-center h-24">
                <Typography variant="h2">{task.title || "Loading..."}</Typography>
            </div>
            <div className="h-fit">
                <Typography>{task.description || "No description available."}</Typography>
            </div>
            <div className="my-11">
                <div className="flex flex-row gap-5">
                <Typography variant="h6">Time</Typography>
                <span>{formatToHumanReadable(task.reminderTime)}</span>
                </div>
            </div>
        </Header>
    );
}

export default ReadTaskPage;
