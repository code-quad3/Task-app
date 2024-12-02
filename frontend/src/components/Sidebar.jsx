import React from "react";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  
  
  Drawer,
  Card,
} from "@material-tailwind/react";
import {

  
  UserCircleIcon,
  Cog6ToothIcon,
  ListBulletIcon,
  PowerIcon,
  HomeIcon,
  PlusCircleIcon,
  ClockIcon,
  CheckIcon
} from "@heroicons/react/24/solid";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
 
 function Sidebar() {
  
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
 
  
 
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
 
  return (
    <div className=" flex justify-end  m-3">
      
      <IconButton variant="text" size="lg" onClick={openDrawer}>
        {isDrawerOpen ? (
          <XMarkIcon className="h-8 w-8 stroke-2 " />
        ) : (
          <Bars3Icon className="h-8 w-8 stroke-2 " />
        )}
      </IconButton>
      <Drawer open={isDrawerOpen} onClose={closeDrawer}>
        <Card
          color="transparent"
          shadow={false}
          className="h-[calc(100vh-2rem)] w-full p-4"
        >
          <div className="mb-2 flex items-center gap-4 p-4">
           
            <Typography variant="h5" color="blue-gray">
                Tasks App
                <Typography variant="h6" color="blue-gray">
                  Yours friendly productivity  tool
                </Typography>
            </Typography>
          </div>
          
          <List>
           
              <ListItem onClick={()=>{
                window.location.href = 'http://localhost:5173/home';
              }}>
                
                  <ListItemPrefix>
                    <HomeIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Home
                  </Typography>
                
              </ListItem>
             
            
              <ListItem onClick={()=>{
                window.location.href="http://localhost:5173/add-task"
              }} >
             
                  <ListItemPrefix>
                    <PlusCircleIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  <Typography color="blue-gray" className="mr-auto font-normal">
                     Add Task
                  </Typography>
                
              </ListItem>
        
            <hr className="my-2 border-blue-gray-50" />
            <ListItem onClick={()=>{
              window.location.href="http://localhost:5173/tasks-list"
            }}>
              <ListItemPrefix>
                <ListBulletIcon className="h-5 w-5" />
              </ListItemPrefix>
               Tasks lists
            </ListItem>

            <ListItem onClick={()=>{
              window.location.href ="http://localhost:5173/overdue-tasks-list"
            }}>
              <ListItemPrefix>
                <ClockIcon className="h-5 w-5" />
              </ListItemPrefix>
               Overdue tasks lists
            </ListItem>
            <ListItem onClick={()=>{
              window.location.href='http://localhost:5173/complete-history';
            }}>
              <ListItemPrefix>
                <CheckIcon className="h-5 w-5" />
              </ListItemPrefix>
               Completed History
            </ListItem>
            <ListItem onClick={()=>{
              window.location.href ='http://localhost:5173/profile';
            }}>
              <ListItemPrefix>
                <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              Profile
            </ListItem>
            <ListItem onClick={()=>{
              window.location.href = 'http://localhost:5173/settings';
            }}>
              <ListItemPrefix>
                <Cog6ToothIcon className="h-5 w-5" />
              </ListItemPrefix>
              Settings
            </ListItem>
            <ListItem>
              <ListItemPrefix>
                <PowerIcon className="h-5 w-5" />
              </ListItemPrefix>
              Log Out
            </ListItem>
          </List>
        </Card>
      </Drawer>
    </div>
  );
}
 

export default Sidebar;