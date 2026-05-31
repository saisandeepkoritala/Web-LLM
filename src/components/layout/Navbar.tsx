import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, Menu, X, Search, LogIn,LogOut } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isUser = useSelector((state : any)=>state.user.isUser);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Search Engine', path: '/search', icon: <Search className="w-4 h-4 mr-1 inline" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight">
          <Bot className="h-6 w-6 text-primary" />
          <span>Core<span className="text-primary">LLM</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `transition-colors hover:text-primary ${
                  isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Auth Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {!isUser ? <Button variant="ghost" asChild size="sm">
            <Link to="/login">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </Button> :<Button variant="ghost" asChild size="sm">
            <Link to="/logout">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Link>
          </Button> }
          <Button asChild size="sm">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-b bg-background px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors p-2 rounded-md hover:bg-accent ${
                    isActive ? 'text-primary bg-accent/50' : 'text-muted-foreground'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
          <hr className="border-border" />
          <div className="flex flex-col space-y-2">
            {!isUser ? <Button variant="outline" asChild className="w-full justify-center" onClick={() => setIsOpen(false)}>
              <Link to="/login">Sign In</Link>
            </Button>: <Button variant="outline" asChild className="w-full justify-center" onClick={() => setIsOpen(false)}>
              <Link to="/logout">Sign Out</Link>
            </Button>}
            {!isUser && <Button asChild className="w-full justify-center" onClick={() => setIsOpen(false)}>
              <Link to="/signup">Get Started</Link>
            </Button>}
          </div>
        </div>
      )}
    </nav>
  );
}