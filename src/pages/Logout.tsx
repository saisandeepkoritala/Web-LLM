import { useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"; 

export default function Logout() {
  useEffect(() => {
    axios.defaults.withCredentials = true;
    const controller = new AbortController();
    
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log("Request timed out. Forcing local logout...");
      forceLocalLogout();
    }, 5000);

    const forceLocalLogout = (): void => {
      localStorage.removeItem("user-info-llm");
      localStorage.removeItem("user-data-llm");
      window.location.href = "/";
    };

    const handleLogout = async (): Promise<void> => {
      try {
        const resp = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL_PROD}/api/v1/user/logout`,
          {},
          { 
            withCredentials: true,
            signal: controller.signal 
          }
        );

        if (resp.status === 200) {
          forceLocalLogout();
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Logout request canceled safely.");
          return; 
        }

        const axiosError = error as AxiosError;
        console.error("Logout Error:", axiosError.message);
        forceLocalLogout();

     } finally {
        forceLocalLogout();
        clearTimeout(timeoutId);
      }
    };

    handleLogout();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 animate-fade-in">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center justify-center space-y-4 pb-2">
          {/* Circular background wrapper for the spinner */}
          <div className="rounded-full bg-muted p-3 text-primary animate-pulse">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight">
            Logging you out
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm">
            Please wait while we securely terminate your session.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}