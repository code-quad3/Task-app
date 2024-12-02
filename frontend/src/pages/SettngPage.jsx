import { Input, Button, DialogHeader,DialogFooter,Dialog,Alert } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import Header from "../components/Header";
function SettngPage() {
  const [email, setEmail] = useState(""); // State for email
  const [name, setName] = useState("");  // State for name
  const[open,setOpen] =useState(false);
  const [isNameDisabled, setIsNameDisabled] = useState(true); // State to manage name input disabled
  const [isEmailDisabled, setIsEmailDisabled] = useState(true); // State to manage email input disabled
  const [profile, setProfile] = useState({ name: "", email: "" });
  const[altopn,setAltopn] = useState(false);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:9000/task/name-email", {
          withCredentials: true,
        });
        setProfile(response.data); // Assuming the API returns { name, email }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, []);

const handleOpen = () => setOpen(!open);
const handleSubmit = async () => {
    try {
      // Send a POST request with name and email as the payload
      const response = await axios.post(
        'http://localhost:9000/task/create-user',
        { name:name, email:email },
        { withCredentials: true } // Include credentials for cookies/auth
      );
  
      // Check if the request was successful
      if (response.status === 200) {
        console.log("Data submitted successfully:", response.data);
        handleOpen(!open);
            
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      setAltopn(!altopn);

    }
  };
  
  return (
    <Header>
         <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Are you sure for changes?</DialogHeader>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleSubmit}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>




{ altopn &&<Alert color="red" onClose={()=>setAltopn(!altopn)}>Error occurred please try again</Alert>}

      {/* Name Section */}
      <div className="flex flex-row gap-2">
        <Input
          variant="standard"
          label={profile.name || 'Name'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isNameDisabled}
        />
        <Button size="sm" onClick={() => setIsNameDisabled(false)}>
          Edit
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setIsNameDisabled(true);
            setName(profile.email ||''); // Optional: Reset the input value on cancel
          }}
        >
          Cancel
        </Button>
      </div>

      {/* Email Section */}
      <div className="flex flex-row gap-2 my-8">
        <Input
          variant="standard"
          label={profile.email || 'Email'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isEmailDisabled}
        />
        <Button size="sm" onClick={() => setIsEmailDisabled(false)}>
          Edit
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setIsEmailDisabled(true);
            setEmail(profile.email || ''); // Optional: Reset the input value on cancel
          }}
        >
          Cancel
        </Button>
      </div>
    </Header>
  );
}

export default SettngPage;
