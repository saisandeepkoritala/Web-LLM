import axios from 'axios';
import { Notify } from './Toast';

export const checkHealth = async()=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL_PROD}/api/v1/user/auth/isAlive`);

        if(response.status!=200) return false

        return true
    }
    catch(err){
        Notify('Something went wrong');
    }
}