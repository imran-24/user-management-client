import clsx from "clsx";
import { Loader } from "lucide-react";

export const Loading = ({large = ""}) => {
    return ( 
    <div className={clsx("flex items-center justify-center",
      large && "h-screen" )}>
      <Loader className="animate-spin text-gray-500" size={large ? 26 : 20} />
    </div>
     );
}


