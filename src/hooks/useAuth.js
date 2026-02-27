import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const useAuth=()=>{
    return useQuery({
        queryKey:["Auth"],
        queryFn:async()=>{
            const res=await axios.get("http://localhost:3000/api/user/me",{withCredentials:true});
            console.log(res)
            return res.data.statusCode;
        },
        retry:false
    })
}

export {useAuth}