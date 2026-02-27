import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UploadPage = () => {
    const navigate=useNavigate();
    const URL=import.meta.env.VITE_API_URL;
  const [preview, setPreview] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const {mutate,isPending}=useMutation({
    mutationFn:async(data)=>{
        const response=await axios.post(`${URL}/api/post/post`,data,{withCredentials:true,
            headers:{
                "Content-Type":"multipart/form-data"
            }
        });
        return response.data;
    },
    onSuccess:(res)=>{
        toast.success(res.message);
        navigate("/info");
    },
    onError:()=>{
      toast.error("error occured creating post")
    }
  })

  const onSubmit = async (data) => {
  const formdata=new FormData();
  formdata.append("image",data.image[0]);
  formdata.append("caption",data.caption|| " ");
  mutate(formdata);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 px-4 py-6 flex flex-col items-center">
      <div className="w-full max-w-[420px] sm:max-w-md bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-800">
        <h1 className="text-2xl font-bold mb-4 text-center">Upload Post</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-zinc-300">Select Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("image", {
                required: "Please select an image",
                onChange: (e) => {
                  const file = e.target.files[0];
                  setPreview(file ? URL.createObjectURL(file) : null);
                },
              })}
              className="text-sm text-zinc-100 file:bg-zinc-800 file:text-zinc-200 file:border-none file:rounded-lg file:px-4 file:py-2"
            />
            {errors.image && (
              <span className="text-red-500 text-xs mt-1">{errors.image.message}</span>
            )}
          </div>

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-full max-h-60 object-cover rounded-xl mt-2 border border-zinc-700"
            />
          )}

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-zinc-300">Caption</label>
            <input
              type="text"
              placeholder="Write something..."
              {...register("caption")}
              className="bg-zinc-800 text-zinc-200 px-4 py-2 rounded-xl border border-zinc-700 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-700 hover:bg-zinc-600 text-zinc-200 py-2 rounded-xl font-semibold transition"
          >
            {isPending ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;