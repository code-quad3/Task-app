
import Header from "../components/Header";

import { Textarea,Input,Button,Alert} from "@material-tailwind/react";
import{useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
function Task(){
   const[time,setTime] =useState(new Date());
   const[title,setTitle] =useState('');
   const[despt,setDespt] =useState('');
   const[open,setOpen] =useState(false);
   const[code,setCode] = useState("");
   const submit = async()=>{
    try{ 
        const response = await axios.post(
            'http://localhost:9000/task/add-tasks',
            { title: title, description: despt, reminderTime: time }, // Data payload
            { withCredentials: true } // Config object
          );
          if(response.status=== 200){
            setOpen(!open);
            setCode('Dn');
          }
    }catch(err){
        if(err.status ===409 || err.status === 411){
            window.location.href ='http://localhost:5173/auth';
        }
        setOpen(!open);
        setCode('eRR')
            console.log("error ocuured",err);
    }
   
   }
   const cancel = ()=>{
    setTitle('');
    setDespt('');
    setTime(new Date());

   }



    return(<>
     {(open && (code ==='Dn')) && <Alert open={open} onClose={()=> setOpen(false)} color="green" >Your response has been saved succesfully</Alert>} 
     {(open && (code ==='eRR')) && <Alert open={open} onClose={()=> setOpen(false)} color="red" >Error ocuured please try again</Alert>} 
    <div className="flex flex-col gap-8" >
<Input label="title" className=""  color="blue" value={title} onChange={(e)=>setTitle(e.target.value)}/>
<div className="flex ">
 <Textarea label="description" color="blue" value={despt} onChange={(e)=>setDespt(e.target.value)}/>  

 </div>
  <div className="flex justify-between">
  <div className="">
 <DatePicker customInput={<Input label="Select time" color="blue" />} selected={time} onChange={(date)=>setTime(date)}  showTimeInput dateFormat={"MM/dd/yyyy h:mm aa"} />
 
 </div>
 <div className="flex justify-end gap-2">
 <Button color="blue" onClick={submit}> submit </Button>
 <Button color="red" onClick={cancel}>cancel</Button>
 </div>
 </div>
 
 </div>
    </> )
}










function AddTaskPage(){
    return(
        <Header>
            <Task />
        </Header>
    )
}
export default AddTaskPage;