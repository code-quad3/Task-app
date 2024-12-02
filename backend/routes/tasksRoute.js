const Tasks = require('../models/Tasks');
const myQueue = require('../producer');
const express=require('express');
const router =express.Router();
const{jwtAuthMiddleware} = require('../jwt');
const mongoose= require('mongoose');
const Person = require('../models/Person')
router.post('/add-tasks', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the userId from the authenticated user
        const { title, description, reminderTime } = req.body;
        const email = req.user.email;
             
    const rTDo =  new Date(reminderTime.toLocaleString());
    rTDo.setSeconds(0);
    rTDo.setMilliseconds(0);
    console.log("Local Time:", rTDo.toLocaleString());
    // Validate the input
    if (!title || !description || !reminderTime) {
        return res.status(400).json({ message: "All fields are required." });
    }
    
    // Parse the reminder time
    const reminderDate = new Date(rTDo);
    if (isNaN(reminderDate.getTime())) {
        console.log("delay error");
        return res.status(400).json({ message: "Invalid reminder time." });
        }
        
        // Calculate delay for the queue
        const currentTime = new Date();
        console.log("the current time is",currentTime.toLocaleString());
        const delay = Number(reminderDate) - Number(currentTime);
        console.log("the delay value is ",delay);
        
        if (delay <= 0) {
            return res.status(400).json({ message: "Reminder time must be in the future." });
        }
        
        // Save the task in MongoDB
        const task = new Tasks({
            title,
            description,
            reminderTime: reminderDate,
            userId
        });
        
        await task.save();
        
        // Add the task to the queue
        await myQueue.add('taskReminder', { taskId: task._id,userEmail: email}, { delay, jobId: task._id.toString()});

        return res.status(200).json({ message: "Task added and scheduled successfully.", task });
    } catch (error) {
        console.error("Error adding task:", error);
        return res.status(500).json({ message: "An error occurred while adding the task." });
    }
});

router.post('/complete',jwtAuthMiddleware, async (req,res)=>{
    console.log("api is hitted");
    try{
    const userId = req.user.id; 
    let { TaskId } = req.body; // Get the task ID from the route parameter
    TaskId =   new mongoose.Types.ObjectId(TaskId);
 const task = await Tasks.findOne({ _id: TaskId, userId });
 task.completed = !(task.completed);

  await task.save();
    return res.status(200).json({message: "Successfully setted the flag"});
    } catch(error){
        return res.status(500).json({message :"Error ocurred while setting completed flag"});
    }
});




router.get('/completed-history', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the userId from the authenticated user
        
        // Fetch all tasks where completed is true and belongs to the user
        const completedTasks = await Tasks.find({ userId, completed: true });
        
        if (completedTasks.length === 0) {
            return res.json({completedTasks: []});
        }
        
        // Transform the completed tasks to the desired format
        const formattedTasks = completedTasks.map(task => ({
            id: task._id,
            title: task.title,
        }));
        
        // Send the formatted tasks as a response
        return res.status(200).json({ completedTasks: formattedTasks });
    } catch (error) {
        console.error("Error fetching completed tasks:", error);
        return res.status(500).json({ message: "An error occurred while fetching completed tasks." });
    }
});


router.get('/pending-tasks', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the userId from the authenticated user

        // Fetch all tasks where completed is false, belongs to the user, and has a future reminder time
        const pendingTasks = await Tasks.find({ 
            userId, 
            completed: false, 
            reminderTime: { $gt: new Date() } 
        }).select('_id title'); // Select only the required fields

        if (pendingTasks.length === 0) {
            console.log([]); // Log empty response
            return res.status(404).json([]); // Return an empty array if no tasks found
        }
        // Map tasks to the required format
        const formattedTasks = pendingTasks.map(task => ({
            _id: task._id.toString(), // Ensure _id is a string
            title: task.title 
        }));

        return res.status(200).json(formattedTasks); // Return the formatted tasks
    } catch (error) {
        console.error("Error fetching pending tasks:", error);
        return res.status(500).json({ message: "An error occurred while fetching pending tasks." });
    }
});







router.delete('/delete-task/:taskId', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the userId from the authenticated user
        let { taskId } = req.params; // Get the task ID from the route parameter
             taskId =  new mongoose.Types.ObjectId(taskId);
        // Find the task in the database to ensure it exists and belongs to the user
        const task = await Tasks.findOne({ _id: taskId, userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found or you don't have permission to delete it." });
        }

    // Remove the task from the queue
    const job = await myQueue.getJob(taskId.toString()); 
     if (job) {
           await job.remove(); // Remove the job from the queue
       }

        // Delete the task from the database
        await Tasks.deleteOne({ _id: taskId });

        return res.status(200).json({ message: "Task deleted successfully." });
    } catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).json({ message: "An error occurred while deleting the task." });
    }
});

router.get('/read-task/:taskId', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the userId from the authenticated user
        let { taskId } = req.params; // Get the task ID from the route parameter
             taskId =  new mongoose.Types.ObjectId(taskId);
        // Find the task in the database to ensure it exists and belongs to the user
        const task = await Tasks.findOne({ _id: taskId, userId });
        if (!task) {
            return res.status(404).json(task);
        }



        return res.status(200).json(task);
    } catch (error) {
        console.error("Error reading task:", error);
        return res.status(500).json({ message: "An error occurred while reading the task." });
    }
});






router.put('/update-task/:taskId', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the userId from the authenticated user
        let { taskId } = req.params; // Get the task ID from the route parameter
        taskId =  new mongoose.Types.ObjectId(taskId);
        const { title, description, reminderTime } = req.body; // Updated task details

        // Validate the input
        if (!title || !description || !reminderTime) {
            return res.status(400).json({ message: "All fields (title, description, reminderTime) are required." });
        }

        // Find the task in the database to ensure it exists and belongs to the user
        const task = await Tasks.findOne({ _id: taskId, userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found or you don't have permission to update it." });
        }

        // Determine if the reminder time has changed
        const isReminderTimeChanged = new Date(task.reminderTime).getTime() !== new Date(reminderTime).getTime();

        // Update the task in the database
        task.title = title;
        task.description = description;
        task.reminderTime = new Date(reminderTime.toLocaleString());
        await task.save();

        // Update the job in the queue only if the reminder time has changed
       const job = await myQueue.getJob(taskId.toString()); 
if (job) {
           await job.update({
               taskId: task._id,
                userEmail: req.user.email, 
          });

            if (isReminderTimeChanged) {
                const currentTime = new Date();
                const delay = Number(reminderTime) - Number(currentTime); // Calculate new delay
                await job.changeDelay(currentDelay);
            }
        } 

        return res.status(200).json({ message: "Task updated successfully." });
    } catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({ message: "An error occurred while updating the task." });
    }
});



router.delete('/clear-history', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the user ID from the authenticated user

        // Delete all completed tasks belonging to the authenticated user
        const result = await Tasks.deleteMany({ userId, completed: true });

        // Respond with a success message and the number of deleted tasks
        return res.status(200).json({
            message: "Completed tasks cleared successfully.",
            deletedCount: result.deletedCount, // Number of tasks deleted
        });
    } catch (error) {
        console.error("Error clearing completed tasks:", error);
        return res.status(500).json({ message: "An error occurred while clearing completed tasks." });
    }
});





router.get('/overdue-list', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the user ID from the authenticated user

        // Fetch all non-completed tasks with a reminderTime in the past
        const overdueTasks = await Tasks.find({
            userId,
            completed: false,
            reminderTime: { $lt: new Date() }, // Check if reminderTime is less than the current time
        });


        if (overdueTasks.length === 0) {
            console.log([]); // Log empty response
            return res.status(404).json([]); // Return an empty array if no tasks found
        }
        // Map tasks to the required format
        const formattedTasks = overdueTasks.map(task => ({
            _id: task._id.toString(), // Ensure _id is a string
            title: task.title 
        }));

        return res.status(200).json(formattedTasks); // Return the formatted tasks

                       


    } catch (error) {
        console.error("Error fetching overdue tasks:", error);
        return res.status(500).json({ message: "An error occurred while fetching overdue tasks." });
    }
});



router.put('/overdue-update-tasks/:tasks', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the user ID from the authenticated user
        const taskId = req.params.tasks; // Extract the task ID from the URL parameter
        const { title, description, reminderTime } = req.body; // Extract updated fields from the request body

        // Find the task to be updated
        const task = await Tasks.findOne({
            _id: taskId,
            userId,
            completed: false,
            reminderTime: { $lt: new Date() }, // Ensure it's overdue
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found or not overdue." });
        }

        // Update task in the database
        task.title = title || task.title;
        task.description = description || task.description;
        task.reminderTime = new Date(reminderTime.toLocaleString()) || new Date (task.reminderTime.toLocaleString()
        );
        await task.save();

        // Add updated task to the queue with the new reminder time
        if (reminderTime) {
            const currentTime =  new Date();
            const delay = Number(reminderTime) - Number(currentTime);
            await myQueue.add(
                'taskRemainder',
                {
                    taskId: task._id,
                    userEmail: req.user.email, 
                },
                { delay: delay > 0 ? delay : 0 ,JobId: task._id.toString()} // Ensure delay is not negative
            ); 
        }

        // Respond with the updated task
        return res.status(200).json({
            message: "Task updated successfully.",
            task,
        });
    } catch (error) {
        console.error("Error updating overdue task:", error);
        return res.status(500).json({ message: "An error occurred while updating the overdue task." });
    }
});


router.delete('/overdue-delete-tasks/:tasks', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the user ID from the authenticated user
        let taskId = req.params.tasks; // Extract the task ID from the URL parameter
        taskId =  new mongoose.Types.ObjectId(taskId);
        // Find and delete the specific non-completed overdue task
        const result = await Tasks.findOneAndDelete({
            _id: taskId,
            userId,
            completed: false,
            reminderTime: { $lt: new Date() }, // Ensure it's overdue
        });

        if (!result) {
            return res.status(404).json({ message: "Task not found or not overdue." });
        }

        // Respond with a success message
        return res.status(200).json({
            message: "Overdue task deleted successfully.",
            task: result, // Return the deleted task for reference
        });
    } catch (error) {
        console.error("Error deleting overdue task:", error);
        return res.status(500).json({ message: "An error occurred while deleting the overdue task." });
    }
});



router.get('/read-overduetask/:taskId', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the userId from the authenticated user
        let { taskId } = req.params; // Get the task ID from the route parameter
             taskId =  new mongoose.Types.ObjectId(taskId);
        // Find the task in the database to ensure it exists and belongs to the user
        const task = await Tasks.findOne({ _id: taskId, userId , completed: false,
            reminderTime: { $lt: new Date() } });
        if (!task) {
            return res.status(404).json(task);
        }


        return res.status(200).json(task);
    } catch (error) {
        console.error("Error reading task:", error);
        return res.status(500).json({ message: "An error occurred while reading the task." });
    }
});



// Route to get total ongoing tasks for today
router.get('/total-tasks-today', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Get the userId from the JWT token payload
        const currentTime = new Date(); // Get the current time
        const startOfDay = new Date(currentTime.setHours(0, 0, 0, 0)); // Start of today (midnight)
        const endOfDay = new Date(currentTime.setHours(23, 59, 59, 999)); // Start of today (midnight)

        // Get the total count of ongoing tasks for the specific user (tasks with remainderTime in the future)
        const totalTasks = await Tasks.countDocuments({
            userId,
            reminderTime: { $lte:  endOfDay }, // Tasks within the current day
            createdAt: {$gte: startOfDay}
        });

        // Return the total count of ongoing tasks in the response
        return res.status(200).json({ totalTasks });
    } catch (error) {
        console.error('Error fetching total tasks for user:', error);
        return res.status(500).json({ message: 'Error fetching total tasks' });
    }
});







router.get('/completed-tasks-today', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Get the userId from the JWT token payload
        const currentTime = new Date(); // Get the current time
        const startOfDay = new Date(currentTime.setHours(0, 0, 0, 0)); // Start of today (midnight)
        const endOfDay = new Date(currentTime.setHours(23, 59, 59, 999)); // end of today (midnight)
        

        // Count completed tasks for the specific user where:
        // - The task is completed,
        // - The task was completed today
        const completedTasksTodayCount = await Tasks.countDocuments({
            userId,
            completed: true, // Only completed tasks
            createdAt: { $gte: startOfDay }, // Tasks completed from midnight today onward
             updatedAt: {$lte: endOfDay}
        });

        // Return the total count of completed tasks in the response
        return res.status(200).json({ completedTasksTodayCount });
    } catch (error) {
        console.error('Error fetching completed tasks for user today:', error);
        return res.status(500).json({ message: 'Error fetching completed tasks for today' });
    }
});

router.get('/completion-rate-week', jwtAuthMiddleware, async (req, res) => {
    try {
      const userId = req.user.id; // Get the userId from the JWT token payload
      const currentDate = new Date();
      const currentDayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const daysToSubtract = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // Adjust for week starting on Monday
      const weekStartDate = new Date(currentDate);
      weekStartDate.setDate(currentDate.getDate() - daysToSubtract); // Start from Monday this week
      weekStartDate.setHours(0, 0, 0, 0); // Reset to start of the day
    
      // Initialize an array to hold the completion rates for the last 7 days
      const completionRates = [];
    
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStartDate);
        day.setDate(weekStartDate.getDate() + i); // Increment day by `i`
        const startOfDay = new Date(day);
        const endOfDay = new Date(day);
        endOfDay.setHours(23, 59, 59, 999); // End of the day
    
        // If the loop's date goes beyond today, push 0 and continue
        if (startOfDay > currentDate) {
          completionRates.push(0);
          continue;
        }
    
        // Fetch completed tasks for that day
        const completedTasks = await Tasks.countDocuments({
          userId,
          completed: true,
          updatedAt: { $gte: startOfDay, $lte: endOfDay }, // Tasks updated on that day
        });
    
        // Fetch total tasks for that day
        const totalTasks = await Tasks.countDocuments({
          userId,
          createdAt: { $lte: endOfDay }, // Tasks created on or before that day
        });
    
        // Calculate the completion rate for that day
        const completionRate = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        completionRates.push(completionRate);
      }
    
      // Return the completion rates in the response
      return res.status(200).json({ completionRates });
    } catch (error) {
      console.error('Error fetching completion rates:', error);
      return res.status(500).json({ message: 'Error fetching completion rates' });
    }
  });
  
    // Get only the user's name
router.get("/name", jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
      const user = await Person.findById(userId).select("name");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ name: user.name });
    } catch (error) {
      console.error("Error fetching user name:", error);
      res.status(500).json({ message: "An error occurred" });
    }
  });
  
  // Get the user's name and email
  router.get("/name-email",jwtAuthMiddleware, async (req, res) => {
    const userId = req.user.id;
    try {
      const user = await Person.findById(userId).select("name email");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ name: user.name, email: user.email });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ message: "An error occurred" });
    }
  });
  
  
 
// Route: Create a new user with name, email, or both
router.post("/create-user", jwtAuthMiddleware,async (req, res) => {
    
  try {
    const { name, email } = req.body;

    // Validate that at least one field is provided
    if (!name && !email) {
      return res.status(400).json({ message: "At least one of 'name' or 'email' is required" });
    }

    // Create a new user object
    const newUser = new Person({
      ...(name && { name }), // Only include 'name' if provided
      ...(email && { email }) // Only include 'email' if provided
    });

    // Save the user to the database
    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }

    return res.status(500).json({ message: "An error occurred while creating the user" });
  }
});




module.exports=router;
