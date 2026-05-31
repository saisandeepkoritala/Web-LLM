// import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios, { type AxiosResponse } from 'axios';
// import { toast } from 'react-toastify';
// import { CiCircleInfo } from 'react-icons/ci';

// // Shadcn primitives imported from your components directory
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";

// export default function Signup() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     passwordConfirm: '',
//     accountType: 'normal'
//   });
  
//   const [code, setCode] = useState<string>("");
//   const [vanish, setVanish] = useState<boolean>(true);
//   const [showVerify, setShowVerify] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
  
//   const navigate = useNavigate();
//   const nameRef = useRef<HTMLInputElement | null>(null);

//   // Auto-focus name field on load
//   useEffect(() => {
//     nameRef.current?.focus();
//   }, []);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const notify = (msg: string, type = 'error') => {
//     const config = {
//       theme: 'colored',
//       style: type === 'error' 
//         ? { background: "#fff5f5", color: "#e53e3e" } 
//         : { background: "#f0fff4", color: "#38a169" }
//     };
//     type === 'error' ? toast.error(msg, config) : toast.success(msg, config);
//   };

//   const verifyPassword = (password: string) => {
//     const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
//     return regex.test(password);
//   };

//   const handleSendCode = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!formData.name || !formData.email) return notify("Please fill in Name and Email");
    
//     setIsLoading(true);
//     try {
//       const resp: AxiosResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL_PROD}/api/v1/user/auth/sendCode`, {
//         name: formData.name,
//         email: formData.email
//       });
//       if (resp.status === 200) {
//         setShowVerify(true);
//         notify("Verification code sent to email!", "success");
//       }
//     } catch (err) {
//       notify("Email already exists or server error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyCode = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!code) return notify("Please enter the verification code");

//     setIsLoading(true);
//     try {
//       const response: AxiosResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL_PROD}/api/v1/user/auth/verifyCode`, {
//         email: formData.email,
//         code: code
//       });
//       if (response.status === 200) {
//         setVanish(false);
//         setShowVerify(false);
//         notify("Email Verified!", "success");
//       }
//     } catch (err) {
//       notify("Invalid verification code");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (formData.password !== formData.passwordConfirm) return notify("Passwords do not match");
//     if (!verifyPassword(formData.password)) return notify("Password does not meet criteria");

//     setIsLoading(true);
//     try {
//       const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL_PROD}/api/v1/user/auth/signup`, formData);
//       if (!response.data.error) {
//         notify("Account created! Please log in.", "success");
//         navigate("/");
//       }
//     } catch (err) {
//       notify("Sign up failed, please try again");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
//       <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-6 shadow-sm sm:p-8 min-h-125 flex flex-col justify-center">
        
//         <div className="space-y-1 text-center">
//           <h2 className="text-2xl font-bold tracking-tight text-foreground">Create Account</h2>
//           <p className="text-sm text-muted-foreground">Join us to start your journey</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2 my-10">
//             <Label htmlFor="name">Full Name</Label>
//             <Input 
//               id="name"
//               type="text" 
//               name="name" 
//               value={formData.name} 
//               onChange={handleChange} 
//               placeholder="John Doe" 
//               ref={nameRef} 
//               required 
//               disabled={!vanish || isLoading}
//             />
//           </div>

//           <div className="space-y-2 my-10">
//             <Label htmlFor="email">Email Address</Label>
//             <Input 
//               id="email"
//               type="email" 
//               name="email" 
//               value={formData.email} 
//               onChange={handleChange} 
//               placeholder="john@example.com" 
//               required 
//               disabled={!vanish || isLoading} 
//             />
//           </div>

//           {vanish && (
//             <div className="space-y-3 pt-2">
//               <div className="flex space-x-2">
//                 <Input 
//                   type="text" 
//                   value={code} 
//                   onChange={(e) => setCode(e.target.value)} 
//                   placeholder="Enter 6-digit code" 
//                   disabled={!showVerify || isLoading}
//                   className='h-10'
//                 />
//                 <button 
//                   type="button" 
//                   onClick={handleSendCode}
//                   disabled={isLoading}
//                   className="inline-flex items-center justify-center rounded-md bg-secondary px-4 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80 h-10 transition-colors whitespace-nowrap disabled:opacity-50"
//                 >
//                   {showVerify ? "Resend" : "Send Code"}
//                 </button>
//               </div>
              
//               {showVerify && (
//                 <button 
//                   type="button" 
//                   onClick={handleVerifyCode}
//                   disabled={isLoading}
//                   className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 h-10 transition-colors disabled:opacity-50"
//                 >
//                   {isLoading ? "Verifying..." : "Verify Code"}
//                 </button>
//               )}
//             </div>
//           )}

//           {!vanish && (
//             <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input 
//                   id="password"
//                   type="password" 
//                   name="password" 
//                   value={formData.password} 
//                   onChange={handleChange} 
//                   placeholder="••••••••" 
//                   required 
//                   disabled={isLoading}
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="passwordConfirm">Confirm Password</Label>
//                 <Input 
//                   id="passwordConfirm"
//                   type="password" 
//                   name="passwordConfirm" 
//                   value={formData.passwordConfirm} 
//                   onChange={handleChange} 
//                   placeholder="••••••••" 
//                   required 
//                   disabled={isLoading}
//                 />
//               </div>
              
//               <div className="flex gap-2.5 rounded-lg border border-border/60 bg-muted/50 p-3 text-xs text-muted-foreground">
//                 <CiCircleInfo className="h-4 w-4 shrink-0 text-primary" />
//                 <p className="leading-normal">Password must be 8+ chars with uppercase, lowercase, number, and symbol.</p>
//               </div>

//               <button 
//                 type="submit" 
//                 disabled={isLoading}
//                 className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 h-10 transition-colors disabled:opacity-50"
//               >
//                 {isLoading ? "Creating Account..." : "Sign Up"}
//               </button>
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CiCircleInfo } from 'react-icons/ci';

// Shadcn primitives imported from your components directory
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ColorCircle } from '@/components/ColorCircle';
import { checkHealth } from '@/utils/checkHealth';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    accountType: 'normal'
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [server,setServer] = useState<boolean>(false);
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement | null>(null);

  // Auto-focus name field on load
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const notify = (msg: string, type = 'error') => {
    const config = {
      theme: 'colored',
      style: type === 'error' 
        ? { background: "#fff5f5", color: "#e53e3e" } 
        : { background: "#f0fff4", color: "#38a169" }
    };
    type === 'error' ? toast.error(msg, config) : toast.success(msg, config);
  };

  const verifyPassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    return regex.test(password);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Core Validations
    if (!formData.name || !formData.email) return notify("Please fill in Name and Email");
    if (formData.password !== formData.passwordConfirm) return notify("Passwords do not match");
    if (!verifyPassword(formData.password)) return notify("Password does not meet criteria");

    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL_PROD}/api/v1/user/auth/signup`, formData);
      if (!response.data.error) {
        notify("Account created! Please log in.", "success");
        navigate("/");
      }
    } catch (err) {
      notify("Sign up failed, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-6 shadow-sm sm:p-8 flex flex-col justify-center">
        
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Create Account</h2>
          <p className="text-sm text-muted-foreground">Join us to start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name"
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="John Doe" 
              ref={nameRef} 
              required 
              disabled={isLoading}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email"
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="john@example.com" 
              required 
              disabled={isLoading} 
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="••••••••" 
              required 
              disabled={isLoading}
            />
          </div>
          
          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">Confirm Password</Label>
            <Input 
              id="passwordConfirm"
              type="password" 
              name="passwordConfirm" 
              value={formData.passwordConfirm} 
              onChange={handleChange} 
              placeholder="••••••••" 
              required 
              disabled={isLoading}
            />
          </div>
          
          {/* Password Requirements Callout */}
          <div className="flex gap-2.5 rounded-lg border border-border/60 bg-muted/50 p-3 text-xs text-muted-foreground">
            <CiCircleInfo className="h-4 w-4 shrink-0 text-primary" />
            <p className="leading-normal">Password must be 8+ chars with uppercase, lowercase, number, and symbol.</p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 h-10 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <ColorCircle color={server?'green':'red'}/>
      </div>
    </div>
  );
}