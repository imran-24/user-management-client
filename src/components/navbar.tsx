import { signOut } from "firebase/auth";
import { Button } from "./ui/button";
import { auth } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { DoorOpen } from "lucide-react";

const Navbar = ({username}: {username: string}) => {
  const navigate = useNavigate();

  function logOut() {
    signOut(auth)
      .then(() => {
        // Sign-out successful
        navigate("/login");
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Error during sign out:", error);
      });
  }

  if(!username) navigate("/login");
  
  return (
    <nav className="w-full fixed top-0 right-0 left-0  bg-white border-b h-12">
      <div className="flex items-center justify-end space-x-2 w-full max-w-7xl  h-full">
        <p className="text-xs">{username}</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={logOut}
                variant={"ghost"}
                size={"icon"}
              >
                <DoorOpen className="size-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </nav>
  );
};

export default Navbar;
