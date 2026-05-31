import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import {useSelector} from 'react-redux'
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer'; 
import Logout from './pages/Logout';



const MainLayout = ()=> (
  <div className="flex flex-col min-h-screen bg-background text-foreground">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 py-8">
      <Outlet /> 
    </main>
    <Footer /> 
  </div>
);

export default function App() {

  const isUser = useSelector((state : any)=>state.user.isUser);

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={!isUser ? <Login />:<Dashboard />} />
        <Route path="/signup" element={!isUser ? <Signup />:<Dashboard />} />
        <Route path="/logout" element={isUser ? <Logout />:<Dashboard />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={isUser ?  <Search /> :<Dashboard />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}