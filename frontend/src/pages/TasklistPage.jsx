import {
  List,
  ListItem,
  ListItemSuffix,
  Typography,
  IconButton,
  Drawer,Alert,Checkbox,
  ListItemPrefix
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
function TaskList() {
  const [openTaskId, setOpenTaskId] = useState(null);
  const [openBottom, setOpenBottom] = useState(false);
  const [tasks, setTasks] = useState([]);
  const[open,setOpen] =useState(false);
  const[code,setCode] = useState("");
  useEffect(() => {
    const fetchTasks = async () => {
        try {
            const response = await axios.get("http://localhost:9000/task/pending-tasks",{withCredentials: true});
           setTasks(response.data);
           console.log("the effect is called");
        } catch (error) {
          if(error.status ===409 || error.status === 411){
            window.location.href ='http://localhost:5173/auth';
        }
            console.error("Error fetching tasks:", error);
        }
    };

    fetchTasks(); 
}, []); 

const handleDelete = async () => {
  try {
    const param = openTaskId; // The ID of the task to be deleted
    const response = await axios.delete(
      `http://localhost:9000/task/delete-task/${param}`,
      { withCredentials: true }
    );

    if (response.status === 200) {
      // Remove the deleted task from the tasks state
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== param));
      console.log('Task deleted successfully');
    } else {
      console.error('Failed to delete the task');
    }
  } catch (error) {
   
    setCode('eRR');

    console.error('Error while deleting the task:', error);
  }
};


  const handleMenuToggle = (TaskId) => {
    setOpenBottom(!openBottom);
    setOpenTaskId(TaskId);
  };


  const handleCheck = async (TaskId) => {
    console.log("the task id is ",TaskId);
    try {
        const response = await axios.post(
            "http://localhost:9000/task/complete", { TaskId }, // Send TaskId as payload
            { withCredentials: true }
        );
        console.log("Task  toogle it :", response.data);

    } catch (error) {
        console.error("Error marking task as completed:", error);
    }
};




  return (
    <>
    {(open && (code ==='eRR')) && <Alert open={open} onClose={()=> setOpen(false)} color="red" >Error ocuured please try again</Alert>}  
    <div>
      <Drawer
        placement="bottom"
        open={openBottom}
        onClose={handleMenuToggle}
        className="p-4"
      >
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            More options
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={handleMenuToggle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
  
        <div>
          <List>
            <ListItem onClick={()=>{
              window.location.href= `http://localhost:5173/read-task/${openTaskId}`
            }}>
              <Typography>Read</Typography>
            </ListItem>
            < ListItem onClick={()=>{
              window.location.href =`http://localhost:5173/update-task/${openTaskId}`
            }}>
              <Typography>Update</Typography>
            </ListItem>
            <ListItem onClick={handleDelete}>
              <Typography>Delete</Typography>
            </ListItem>
          </List>
        </div>
      </Drawer>
  
      {tasks.length > 0 ? (
        <List>
          {tasks.map((task) => (
            <ListItem key={task._id} className="flex justify-between items-center">
              <ListItemPrefix>
                <Checkbox
                  id={task._id}
                  color="blue"
                  ripple={false}
                  className="hover:before:opacity-0"
                  onClick={()=> handleCheck(task._id)}
                  containerProps={{
                    className: "p-0",
                  }}
                />
              </ListItemPrefix>
              <Typography variant="h6" color="blue-gray">
                {task.title}
              </Typography>
              <ListItemSuffix>
                <div>
                  <button onClick={() => handleMenuToggle(task._id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                      />
                    </svg>
                  </button>
                </div>
              </ListItemSuffix>
            </ListItem>
          ))}
        </List>
      ) : (
        <p className="text-center text-blue-gray-500 mt-4">No tasks</p>
      )}
    </div>
    </>
  );
} 


function TasklistPage(){
  return(<Header>
    <TaskList />
  </Header>)
}



export default TasklistPage;
