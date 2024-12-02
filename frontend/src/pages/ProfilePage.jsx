import { useEffect, useState } from "react";
import Header from "../components/Header";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";
import axios from "axios";

function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", email: "" });

  // Fetch user name and email on component mount
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

  return (
    <Header>
      <div className="h-1/2 w-full flex justify-center">
        <div className="w-28 h-28">
          <UserCircleIcon />
        </div>
      </div>

      <div className="my-7">
        <Typography className="text-center" variant="h6">
          {profile.name || "No Name"}
        </Typography>
        <Typography className="text-center" variant="h6">
          {profile.email || "No Email"}
        </Typography>
      </div>
    </Header>
  );
}

export default ProfilePage;
