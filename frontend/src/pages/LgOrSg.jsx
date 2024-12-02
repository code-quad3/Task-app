import { useState } from "react";
import Header from "../components/Header";
import {
    Card,
    Input,
    Button,
    Typography,
  } from "@material-tailwind/react";

  import {z} from 'zod';
const SignUpSchema = z.object({
  email: z.string().email({ message :'Invalid email address'}),
  pwd: z.string().min(6, { message:'Password must be at least 6 character long'})
  .regex(/[A-Z]/, { message: `must contain at least one uppercase letter`})
  .regex(/\d/, { message: '  must contain at least one numeric digit'})
  .regex(/[@$!%*?&]/, { message: ' must contain at least one special character'}),
}); 
import axios from 'axios';



   function SimpleRegistrationForm({setOpen ,open}) {
const[name,setName] =useState('');
const[email,setEmail] =useState('');
const[pwd,setPwd] =useState('');
const[error,setErrorMessage] =useState({});
const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent form submission from reloading the page

  // Validate inputs using Zod schema
  const result = SignUpSchema.safeParse({ email, pwd });
  if (result.success) {
    setErrorMessage({});
    try {
      // Post data to the server
      const response = await axios.post("http://localhost:9000/auth/signup", {name:name, email:email, password:pwd },{withCredentials:true});
      if(response.status === 200){
        window.location.href ='http://localhost:5173/home';
      }
      console.log("Login successful:", response.data); // Handle successful login
    } catch (error) {
      console.error("Signup failed:", error);
      setErrorMessage({ server: "Signup failed. Please try again." }); // Handle server errors
    }
  } else {
    // Set validation errors
    setErrorMessage(result.error.flatten().fieldErrors);
    return;
  }
};



    return (
       <Card color="transparent" shadow={false} className="flex items-center justify-center">
        <Typography variant="h4" color="blue-gray">
          Sign Up
        </Typography>
        
        <Typography color="gray" className="mt-1 font-normal">
          Nice to meet you! Enter your details to register.
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Name
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}  value={name} onChange={(e) => setName(e.target.value)}
            />
             {error.email && <p className="mt-2 text-sm text-red-600">{error.email}</p>}
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Email
            </Typography>
            
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              value={email}
              labelProps={{
                className: "before:content-none after:content-none",
              }}    onChange={(e) => setEmail(e.target.value)}
            />

            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            {error.pwd && <p className="mt-2 text-sm text-red-600">{error.pwd}</p>}
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              value={pwd}
              labelProps={{
                className: "before:content-none after:content-none",
              }}   onChange={(e) => setPwd(e.target.value)}
            />
          </div>
        
          <Button className="mt-6" fullWidth  type="submit"> 
            sign up
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <button className="font-medium text-gray-900" onClick={ ()=>setOpen(!open)}>
              Sign In
            </button>
          </Typography>
        </form>
      </Card>
    );
  }
  







  const loginSchema = z.object({
    email: z.string().email({ message :'Invalid email address'}),
    password: z.string().min(6, { message:'Password must be at least 6 character long'})
    .regex(/[A-Z]/, { message: `must contain at least one uppercase letter`})
    .regex(/\d/, { message: '  must contain at least one numeric digit'})
    .regex(/[@$!%*?&]/, { message: ' must contain at least one special character'}),
  });


  function LoginForm({setOpen,open}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage , setErrorMessage] = useState({});


    const handleLoginSubmit = async (e) => {
      e.preventDefault(); // Prevent form submission from reloading page
      const result = loginSchema.safeParse({ email, password });
      if (result.success) {
        setErrorMessage({});
        try {
          
          // Post data to the server
          const response = await axios.post("http://localhost:9000/auth/login", {email:email, password:password },{withCredentials: true});
          if(response.status === 200){
            window.location.href ='http://localhost:5173/home';
          }
          console.log("Login successful:", response.data); // Handle successful login
        } catch (error) {
          console.error("Login failed:", error);
          setErrorMessage({ server: "Login failed. Please try again." }); // Handle server errors
        }
      } else {
        // Set validation errors
        setErrorMessage(result.error.flatten().fieldErrors);
        return;
      }
      }




    return (<> 
    
    
       <Card color="transparent" shadow={false} className="flex items-center justify-center">
        <Typography variant="h4" color="blue-gray">
          Login
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Nice to meet you! Enter your details to Login.
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleLoginSubmit}>
          <div className="mb-1 flex flex-col gap-6">
          {errorMessage.email && <p className="mt-2 text-sm text-red-600">{errorMessage.email}</p>}
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }} value={email} onChange={(e)=>setEmail(e.target.value)}
            />
            {errorMessage.password && <p className="mt-2 text-sm text-red-600">{errorMessage.password}</p>}
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}  value={password} onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
        
          <Button className="mt-6" fullWidth type="submit">
            login
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
             Dont't have an account?{" "}
            <button  className="font-medium text-gray-900" onClick={()=> setOpen(!open)}> 
              Sign Up
            </button>
          </Typography>
          
            
            <a className="font-medium text-gray-900 text-center block" href="http://localhost:5173/forgot-password"> 
              Forgot password
            </a>
          
        </form>
      </Card>
      </>
    );
  }




function LgOrSg(){
  const[open, setOpen] =useState(false);
    return(
      <>
   {(!open && <SimpleRegistrationForm  setOpen={setOpen} open ={open}/>)}
   {(open && <LoginForm setOpen={setOpen} open={open}/>)}
   </>
    );
}
export default LgOrSg;