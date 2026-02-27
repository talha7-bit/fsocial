import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const URL=import.meta.env.VITE_API_URL;
const useAuth=()=>{
    return useQuery({
        queryKey:["Auth"],
        queryFn:async()=>{
            const res=await axios.get(`${URL}/api/user/me`,{withCredentials:true});
            console.log(res)
            return res.data.statusCode;
        },
        retry:false
    })
}

export {useAuth}