import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-full space-y-4'>
      <div>
        <p className='text-neutral-500 tracking-wider '>Welcome to</p>
        <p className='text-5xl font-bold'>User Management System</p>
      </div>
      <div className='flex items-center space-x-2'>
        <Button 
        variant={"secondary"}
        asChild>
          <Link to={"/login"}>Login</Link>
        </Button>
        <Button asChild>
          <Link to={"/register"}>Join now</Link>
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
