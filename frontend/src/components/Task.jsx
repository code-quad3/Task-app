import { Textarea, Input, Button, Alert} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useParams } from "react-router-dom";

function Task({ fetchapiUrl, postapiUrl }) {
    const [time, setTime] = useState(new Date());
    const [title, setTitle] = useState("");
    const [despt, setDespt] = useState("");
    const [initialTaskData, setInitialTaskData] = useState(null); // New state to store the fetched task data
    const[open,setOpen] =useState(false);
    const[code,setCode] = useState("");
    const { taskId } = useParams();
    useEffect(() => {
        if (taskId) {
            // Fetch existing task details for update
            const fetchTask = async () => {
                try {
                    const response = await axios.get(`${fetchapiUrl}/${taskId}`, { withCredentials: true });
                    const task = response.data;
                    setTitle(task.title || "");
                    setDespt(task.description || "");
                    setTime(new Date(task.reminderTime || Date.now()));
                    // Store initial data after fetching
                    setInitialTaskData({
                        title: task.title || "",
                        description: task.description || "",
                        reminderTime: new Date(task.reminderTime || Date.now())
                    });
                } catch (error) {
                    if(error.status ===409 || error.status === 411){
                        window.location.href ='http://localhost:5173/auth';
                    }
                    console.error("Error fetching task details:", error);
                    setOpen(!open);
                    setCode('eRR')
                    console.error("Error submitting task:", error);
                }
            };
            fetchTask();
        }
    }, [fetchapiUrl, taskId]);

    const submit = async () => {
        try {
            const payload = { title:title, description: despt, reminderTime: time };

            if (taskId) {
                // Update task
              const response =  await axios.put(`${postapiUrl}/${taskId}`, payload, { withCredentials: true });
              if(response.status=== 200){
                setOpen(!open);
                setCode('Dn');
              }
                console.log("Task updated successfully");
            } else {
                // Create new task
                await axios.post(postapiUrl, payload, { withCredentials: true });
                console.log("Task created successfully");
            }

            // Clear fields after submission
            cancel();
        } catch (error) {
            setOpen(!open);
            setCode('eRR')
            console.error("Error submitting task:", error);
        }
    };

    const cancel = () => {
        if (initialTaskData) {
            // Reset the form fields to the initial fetched data
            setTitle(initialTaskData.title);
            setDespt(initialTaskData.description);
            setTime(initialTaskData.reminderTime);
        }
    };

    return (<>
    {(open && (code ==='Dn')) && <Alert open={open} onClose={()=> setOpen(false)} color="green" >Your response has been saved succesfully</Alert>} 
    {(open && (code ==='eRR')) && <Alert open={open} onClose={()=> setOpen(false)} color="red" >Error ocuured please try again</Alert>}     
        
        <div className="flex flex-col gap-8">
            <Input
                label="Title"
                color="blue"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex">
                <Textarea
                    label="Description"
                    color="blue"
                    value={despt}
                    onChange={(e) => setDespt(e.target.value)}
                />
            </div>
            <div className="flex justify-between">
                <div>
                    <DatePicker
                        customInput={<Input label="Select Time" color="blue" />}
                        selected={time}
                        onChange={(date) => setTime(date)}
                        showTimeInput
                        dateFormat={"MM/dd/yyyy h:mm aa"}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button color="blue" onClick={submit}>
                        Submit
                    </Button>
                    <Button color="red" onClick={cancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
        </>
    );
}

export default Task;
