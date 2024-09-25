import { Button } from "@/components/ui/button";
import { auth } from "@/firebase";
import { Loader2 } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <div className='flex flex-col items-center justify-center h-full space-y-4'>
      <div className="mx-auto ">
        <p className='text-neutral-500 tracking-wider '>Welcome to</p>
        <p className='text-3xl lg:text-5xl font-bold'>User Management System</p>
      </div>
      {!user && !loading && (
        <div className='flex items-center space-x-2'>
          <Button variant={"secondary"} asChild>
            <Link to={"/login"}>Login</Link>
          </Button>
          <Button asChild>
            <Link to={"/register"}>Join now</Link>
          </Button>
        </div>
      )}
      {loading && (
        <div className='flex items-center justify-center space-x-3'>
          {/* <p className='text-sm text-neutral-500'>
          Checking user authentication...
        </p> */}
          <Loader2 className='animate-spin h-4' />
        </div>
      )}
      {user && (
        <Button asChild>
          <Link to={"/dashboard"}>Enter to continue</Link>
        </Button>
      )}
    </div>
  );
};

export default LandingPage;
