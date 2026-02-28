import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";


const Login = () => {
    const {handleSubmit,register}=useForm();
    const navigate=useNavigate();
    const URL=import.meta.env.VITE_API_URL;

    const {mutate}=useMutation({
        mutationFn:async(data)=>{
            const res=await axios.post(`${URL}/api/user/login`,data,{withCredentials:true});
            console.log(res);
            return res.data;
        },
        onSuccess:(res)=>{
          navigate("/");
        },
        onError:(err)=>{
            alert("an error occured try again")
        }
    })

    const submit=(formdata)=>{
    mutate(formdata)
    }
  return (
  <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 px-4">

    <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 sm:p-10 border border-white/20">
      
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        Welcome Back
      </h1>

      <form onSubmit={handleSubmit(submit)} className="space-y-6">

        <div className="flex flex-col gap-2">
          <label className="text-white font-medium">Email</label>
          <input
            type="email"
            placeholder="test@gmail.com"
            {...register("email", { required: true })}
            className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-white transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white font-medium">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("password", { required: true })}
            className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-white transition"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-white text-gray-800 font-semibold hover:bg-gray-200 transition duration-300"
        >
          Login
        </button>
      </form>

      <p className="text-center text-white mt-6 text-sm">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-blue-300 hover:text-blue-400 font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
    <Navbar/>
  </div>

  )
}

export default Login