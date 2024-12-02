import Header from "../components/Header";
import { Typography } from "@material-tailwind/react";
import DgNt from "../components/DgNt";
import Lg from "../components/Lg";
import { useState,useEffect } from "react";
import axios from "axios";
function HomePage(){
const[name , setName] =useState('');
    useEffect(() => {
        const fetchName = async () => {
            try {
                const response = await axios.get("http://localhost:9000/task/name",{withCredentials: true});
              setName(response.data.name);
            
            } catch (error) {
              if(error.status ===409 || error.status === 411){
                window.location.href ='http://localhost:5173/auth';
            }
                console.error("Error fetching tasks:", error);
            }
        };
    
        fetchName(); 
    }, []); 

    
return (<>
 <Header>
<div className="h-24">
<Typography variant="h5" className="text-center">Welcome!</Typography>
<Typography variant="h2" className="text-center">
    {name}
</Typography>
</div>
</Header>
<hr/>
<div className="m-7">
    <div className="flex justify-between">
    <Typography  variant="h6">
        Today tasks progress
    </Typography>
<Typography className="mr-24" variant="h6">
    Weekly productivity
</Typography>
       
</div>
    <div className="flex  justify-between">
        
            <DgNt />
        <Lg />

    </div>
</div>
</>)
}



export default HomePage;