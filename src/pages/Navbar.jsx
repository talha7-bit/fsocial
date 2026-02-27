import { Home, User, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const Navbar = () => {
  const {data:isauth,isLoading:authloading}=useAuth();
  const navigate=useNavigate();

  const handleclick=()=>{
    if(!authloading){
     if(isauth && isauth==200){
       navigate("/upload");
    }else{
      navigate("/info");
    }
   }
  }
  return (
    <nav className="fixed bottom-0 w-[400px] bg-zinc-900 border-t border-zinc-800 flex justify-center z-50">
      <div className="w-full max-w-[420px] sm:max-w-md flex justify-between items-center px-6">
        <button className="flex flex-col items-center text-zinc-200 hover:text-white transition-colors">
         <Link to="/"><Home className="w-4 h-4" /></Link>
          
        </button>
        <button onClick={handleclick} className="flex flex-col items-center text-zinc-200 hover:text-white transition-colors -mt-3 cursor-pointer">
          <div className="bg-zinc-800 p-3 rounded-full shadow-lg">
            <Plus className="w-4 h-4" />
          </div>
          
        </button>

        <button className="flex flex-col items-center text-zinc-200 hover:text-white transition-colors">
        <Link to="/info"><User className="w-4 h-4" /></Link>
         
        </button>
      </div>
    </nav>
  );
};

export default Navbar;