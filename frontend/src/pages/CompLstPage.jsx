import {
    List,
    ListItem,
    Typography,
    ListItemPrefix,
    Alert,
  } from "@material-tailwind/react";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import { EllipsisVerticalIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
  
  function TaskList({ tasks, onClearHistory, open, code, setOpen }) {
    return (
      <>
        {open && code === "eRR" && (
          <Alert
            open={open}
            onClose={() => setOpen(false)}
            color="red"
          >
            Error occurred, please try again.
          </Alert>
        )}
  
        <div>
          {tasks.length > 0 ? (
            <List>
              {tasks.map((task) => (
                <ListItem
                  key={task._id}
                  className="flex justify-between items-center"
                >
                  <ListItemPrefix></ListItemPrefix>
                  <Typography variant="h6" color="blue-gray">
                    {task.title}
                  </Typography>
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
  
  function CompLstPage() {
    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState("");
  
    useEffect(() => {
      const fetchTasks = async () => {
        try {
          const response = await axios.get(
            "http://localhost:9000/task/completed-history",
            { withCredentials: true }
          );
          setTasks(response.data.completedTasks); // Ensure `completedTasks` is used
        } catch (error) {
          if (error.response?.status === 409 || error.response?.status === 411) {
            window.location.href = "http://localhost:5173/auth";
          }
          setCode("eRR");
          console.error("Error fetching tasks:", error);
        }
      };
  
      fetchTasks();
    }, []);
  
    const ClrHis = async () => {
      try {
        const response = await axios.delete(
          "http://localhost:9000/task/clear-history",
          { withCredentials: true }
        );
        if (response.status === 200) {
          setTasks([]);
        }
      } catch (error) {
        if (error.response?.status === 409 || error.response?.status === 411) {
          window.location.href = "http://localhost:5173/auth";
        }
        setCode("eRR");
        console.error("Error clearing history:", error);
      }
    };
  
    return (
      <div>
        <div className="h-7 w-full flex justify-between">
          <ArrowLeftIcon
            onClick={() => {
              window.location.href = "http://localhost:5173/home";
            }}
          />
          <EllipsisVerticalIcon onClick={ClrHis} />
        </div>
        <TaskList
          tasks={tasks}
          onClearHistory={ClrHis}
          open={open}
          code={code}
          setOpen={setOpen}
        />
      </div>
    );
  }
  
  export default CompLstPage;
  