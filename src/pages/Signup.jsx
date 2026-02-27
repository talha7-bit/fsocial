import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from './Navbar';

const Signup = () => {
    const {register,handleSubmit}=useForm();
    const navigate=useNavigate();

    const {mutate}=useMutation({
        mutationFn:async(data)=>{
            const res=await axios.post("http://localhost:3000/api/user/signup",data,{withCredentials:true});
            return res.data;
        },
        onSuccess:(res)=>{
            navigate("/info");
        },
        onError:(err)=>{
            toast.error("user already exist");
        }
    })

    const submit=(formdata)=>{
    mutate(formdata)
    }
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 px-4">

  <div className="w-full mt-5 max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 sm:p-10">

    <h1 className="text-3xl font-bold text-white text-center mb-8">
      Create Account
    </h1>

    <form onSubmit={handleSubmit(submit)} className="space-y-6">

      <div className="flex flex-col gap-2">
        <label className="text-white font-medium">Name</label>
        <input
          type="text"
          placeholder="John Doe"
          {...register("name", { required: true })}
          className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-white transition"
        />
      </div>
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
        Sign Up
      </button>

    </form>

    <p className="text-center text-white mt-6 text-sm">
      Already have an account?{" "}
      <Link
        to="/login"
        className="text-blue-300 hover:text-blue-400 font-medium"
      >
        Login
      </Link>
    </p>

  </div>
  <Navbar/>
</div>
  )
}

export default Signup