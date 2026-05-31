import { Link } from 'react-router-dom';
// Standard Lucide icons wrapper
import { LuBot, LuCpu } from 'react-icons/lu';
// Clean, official brand icons
import { SiGithub, SiX,SiInstagram} from 'react-icons/si';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-card text-card-foreground mt-auto">
      <div className="container mx-auto px-4 py-8 md:py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand column */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center space-x-2 font-bold text-lg">
            <LuBot className="h-5 w-5 text-primary" />
            <span>Core<span className="text-primary">LLM</span></span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Advanced semantic indices paired seamlessly with modern language models. Secure processing across normal and premium nodes.
          </p>
        </div>

        {/* Navigation column */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">Platform</h3>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</Link>
          <Link to="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">Search Index</Link>
          <a href="https://status.corellm.dev" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
            <LuCpu className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
            System Status
          </a>
        </div>

        {/* Social / Repo links */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">Community</h3>
          <div className="flex items-center space-x-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
              <SiGithub className="h-5 w-5" />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="X (Twitter)">
              <SiX className="h-4 w-4" /> {/* Slightly smaller to optically match GitHub's visual weight */}
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
              <SiInstagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="border-t border-border/60 bg-muted/40 py-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground space-y-2 sm:space-y-0">
          <div>
            &copy; {currentYear} CoreLLM Inc. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}