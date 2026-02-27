import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Check, Heart, Plus } from "lucide-react";
import Navbar from "./Navbar";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Feed = () => {
    const queryclient=useQueryClient();
    const navigate=useNavigate();
    const URL=import.meta.env.VITE_API_URL;
    console.log(URL);
    const {data:isauth,isLoading:authloading}=useAuth();
  const {data:posts=[],isLoading}=useQuery({
    queryKey:["fetchallposts"],
    queryFn:async()=>{
        const response=await axios.get(`${URL}/api/post/getallposts`,{withCredentials:true});
        const allposts=response.data.data;

        const postswithlikes=[];
        for(let p of allposts){
           if(isauth && isauth==200){
             try {
                const res=await axios.get(`${URL}/api/post/isliked/${p._id}`,{withCredentials:true});
                const ress=await axios.get(`${URL}/api/post/isfollowed/${p._id}`,{withCredentials:true});
                postswithlikes.push({...p,isliked:res.data.data,isfollowed:ress.data.data});
            } catch (error) {
                console.log("an error occured",error)
            
           }}else{
            postswithlikes.push({...p});
           }
        }
        return postswithlikes;
    }
  })

  const {mutate}=useMutation({
    mutationFn:async(id)=>{
        const response=await axios.post(`${URL}/api/user/like/${id}`,{},{withCredentials:true});
        return response.data;
    },
    onSuccess:(res)=>{
    queryclient.invalidateQueries(["fetchallposts"]);
    }
  })

  const handleclick=(id)=>{
  if(!authloading){
     if(isauth && isauth==200){
      mutate(id);
    }else{
      navigate("/info");
    }
   }
  }

  const {mutate:follow}=useMutation({
    mutationFn:async(id)=>{
        const response=await axios.post(`${URL}/api/follower/follow/${id}`,{},{withCredentials:true});
        return response.data;
    },
    onSuccess:(res)=>{
        queryclient.invalidateQueries(["fetchallposts"])
    }
  })

  const handlefollow=(id)=>{
   if(!authloading){
     if(isauth && isauth==200){
      follow(id);
    }else{
      navigate("/info");
    }
   }
    
  }
  if(isLoading){
    return(
        <div className="min-h-screen bg-zinc-950 flex items-center top-1/2 justify-center text-white text-xl font-semibold">
            Loading...
        </div>
    )
  }
  return (
    <div className="min-h-screen bg-zinc-950 flex justify-center">
      <div className="w-full max-w-[420px] min-h-screen bg-zinc-950 text-zinc-200 px-3 py-6 space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4">
              <img
                src={
                  post.user?.profile ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="font-semibold text-sm text-zinc-100">
                {post.username || "Unknown User"}
              </span>
              <button onClick={()=>handlefollow(post._id)}>{!post?.isfollowed ? <Plus className="text-red-500 cursor-pointer"/> : <Check className="text-blue-300 cursor-pointer"/>}</button>
            </div>
            <img
              onDoubleClick={()=>handleclick(post._id)}
              src={post.image}
              alt="post"
              className="w-full aspect-square object-cover"
            />
            <div className="p-4 space-y-2">

              <div className="flex items-center gap-2 text-zinc-300">
                <Heart onClick={()=>handleclick(post._id)} className={`cursor-pointer w-5 h-5 ${post?.isliked ? "text-red-500 fill-red-500" : "text-white fill-current"}`} />
                <span className="text-sm font-medium">

                  {post.likes.length} likes
                </span>
              </div>

              {post.caption && (
                <p className="text-sm text-zinc-400">
                  <span className="font-semibold text-zinc-200">
                    {post.username || "Unknown"}{" "}
                  </span>
                  {post.caption}
                </p>
              )}
            </div>

          </div>
        ))}

      </div>
      
    <Navbar/>
    </div>
  );
};

export default Feed;