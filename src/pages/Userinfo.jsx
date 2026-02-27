import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Heart } from "lucide-react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { toast } from "react-toastify";

const Userinfo = () => {
  const queryClient = useQueryClient();
  const { data: userinfo, isLoading } = useQuery({
    queryKey: ["userinfo"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/user/userinfo", {
        withCredentials: true,
      });
      return res.data.data;
    },
  });

   const { data: follow, isLoading: floading } = useQuery({
    queryKey: ["follow"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/user/getfandf", {
        withCredentials: true,
      });
      return res.data.data;
    },
  });

  const { data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/post/getall", {
        withCredentials: true,
      });
      const allPosts = res.data.data;

      const postsWithLikes = [];
      for (let p of allPosts) {
        try {
         
          const likeRes = await axios.get(
            `http://localhost:3000/api/post/isliked/${p._id}`,
            { withCredentials: true }
          );
          postsWithLikes.push({ ...p, isliked: likeRes.data.data });
        
        } catch (error) {
          console.log("Error fetching like status", error);
        }
      }
      return postsWithLikes;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      const response = await axios.post(
        `http://localhost:3000/api/user/like/${id}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleClick = (id) => mutate(id);


  const {mutate:deletep}=useMutation({
  mutationFn:async(id)=>{
    const response=await axios.post(`http://localhost:3000/api/post/delete/${id}`,{},{withCredentials:true});
    return response.data;
  },
  onSuccess:(res)=>{
    queryClient.invalidateQueries(["posts"])
    toast.success(res.message);
  }
  })
  const handledelete=(id)=>{
  deletep(id);
  }
  const followersCount = follow?.followers?.length || 0;
  const followingCount = follow?.following?.length || 0;
  const name = userinfo?.name || "Unknown User";
  const profilePic =
    userinfo?.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const email = userinfo?.email || "user@example.com";

  const {mutate:logout}=useMutation({
    mutationFn:async()=>{
      const res=await axios.post("http://localhost:3000/api/user/logout",{},{withCredentials:true});
      return res.data.data
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["Auth"]);
      window.location.reload();
    }
  })
  const handlelogout=()=>{
  logout();
  }
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col items-center py-6 px-4">
      <div className="w-full max-w-[calc(100%-40px)] sm:max-w-[400px] bg-zinc-900 rounded-2xl p-6 flex flex-col items-center shadow-lg border border-zinc-800 mb-8">
        <button onClick={handlelogout} className="cursor-pointer bg-gray-700 px-4 py-1 rounded-md border-2 border-gray-100 text-white m-3">Logout</button>
        <img
          src={profilePic}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-zinc-700"
        />

        {isLoading ? (
          <div className="text-2xl font-bold">Loading...</div>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-center">{name}</h1>
            <p className="text-zinc-400 text-sm">{email}</p>
          </div>
        )}

        {floading ? (
          <div className="flex gap-8 mt-4">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-zinc-200">0</span>
              <span className="text-zinc-400 text-sm">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-zinc-200">0</span>
              <span className="text-zinc-400 text-sm">Following</span>
            </div>
          </div>
        ) : (
          <div className="flex gap-8 mt-4">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-zinc-200">{followersCount}</span>
              <span className="text-zinc-400 text-sm">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-zinc-200">{followingCount}</span>
              <span className="text-zinc-400 text-sm">Following</span>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-[calc(100%-40px)] sm:max-w-[400px] flex flex-col gap-6">
        {posts?.length ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg"
            >
              <div className="flex items-center gap-3 p-4">
                <img
                  src={profilePic}
                  alt="profile"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <span className="font-semibold text-sm text-zinc-100">{name}</span>
              </div>
              <img
                onDoubleClick={() => handleClick(post._id)}
                src={post.image}
                alt="post"
                className="cursor-pointer w-full aspect-square object-cover"
              />

              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Heart
                    onClick={() => handleClick(post._id)}
                    className={`cursor-pointer w-5 h-5 ${
                      post.isliked ? "text-red-500 fill-red-500" : "text-white fill-current"
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {post.likes?.length || 0} likes
                  </span>
                </div>

                {post.caption && (
                  <p className="text-sm text-zinc-400">
                    <span className="font-semibold text-zinc-200">{name} </span>
                    {post.caption}
                  </p>
                )}
                <button onClick={()=>handledelete(post._id)} className="cursor-pointer px-4 py-1 bg-red-500 text-white rounded-md">Delete Post</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-zinc-400">No posts yet</p>
        )}
      </div>

      <Navbar />
    </div>
  );
};

export default Userinfo;