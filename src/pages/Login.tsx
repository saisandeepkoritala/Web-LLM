import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Notify as notify} from '../utils/Toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { login } from '@/store';
import { useDispatch } from 'react-redux';
import queryString from 'query-string';
import {Notify} from '../utils/Toast'
import { ColorCircle } from '@/components/ColorCircle';
import { checkHealth } from '@/utils/checkHealth';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [server,setServer] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

   useEffect(() => {
        // 1. Parse the search string from the URL
        const queryParams = queryString.parse(location.search);
        
        if (queryParams.userData) {
            try {
                // 2. Decode and parse the JSON string
                const decodedData = JSON.parse(decodeURIComponent(queryParams.userData as string));
                
                // 3. Extract the specific keys from your URL
                const { _id, userName, email, picture } = decodedData;

                if (_id && userName) {
                    // 4. Dispatch to Redux
                    dispatch(login({ 
                        id: _id,
                        name: userName,
                        email: email,
                        avatar: picture
                    }));

                    // 5. Success notification and Redirect
                    Notify("Welcome! Google login successful.");
                    navigate("/", { replace: true });
                }
            } catch (error) {
                console.error("Failed to parse Google user data:", error);
                Notify("Authentication failed. Please try again.");
            }
        }
    }, [location.search, dispatch, navigate]);

    useEffect(()=>{

      const getStatus=async()=>{
        const q= await checkHealth();
        if(q) setServer(true);
      }

      let interval : any;
      if(!server) {
        interval = setInterval(getStatus,2000);
      }  

      return ()=> clearInterval(interval);

    },[server])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL_PROD}/api/v1/user/auth/login`, {email,password});
      if (!response.data.error) {
        notify("Log in.", "success");
        const {_id,userName,email,avatar} = response.data.data.user;
        dispatch(login({id:_id,name:userName,email,avatar}));
        navigate("/");
      }
    } catch (err) {
      notify("Login in failed, please try again");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-zinc-950 px-4">
      <Card className="w-full max-w-md shadow-lg min-h-125 flex justify-center">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center pt-4">Welcome Back</CardTitle>
          <CardDescription className="text-center">Enter your details to log into your LLM account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2 my-5">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                autoComplete='email'
                required 
              />
            </div>
            <div className="space-y-2 my-5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  placeholder="*********" 
                  onChange={e => setPassword(e.target.value)} 
                  autoComplete='current-password'
                  required 
                />
              </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">

            <Button type="submit" className="w-full my-5">Sign In</Button>
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account? <Link to="/signup" className="text-primary hover:underline">Create account</Link>
            </div>
            
            <div className="text-sm text-center text-muted-foreground">
              Sign in with google? <Link to={`${import.meta.env.VITE_BACKEND_URL_PROD}/api/v1/user/auth/google`} className="text-primary hover:underline">Google login</Link>
            </div>
            
          </CardFooter>
        </form>
        <ColorCircle color={server?'green':'red'}/>
      </Card>
    </div>
  );
}