import { Card, CardContent,CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { BrainCircuit, Sparkles, ShieldCheck } from "lucide-react";
import { useSelector } from "react-redux";

export default function Dashboard() {

  const isUser = useSelector((state : any)=>state.user.isUser);
  return (
    <div className="flex flex-col items-center justify-center space-y-12 max-w-5xl mx-auto py-10">
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="px-3 py-1">Next-Gen Intelligence</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          Empower Your Workflow with <span className="text-primary">LLM Search</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Context-aware language model capabilities baked right into an instantaneous querying interface.
        </p>
        <div className="pt-4 flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/search">Try Searching Now</Link>
          </Button>
          {!isUser && <Button asChild variant="outline" size="lg">
            <Link to="/login">Sign In</Link>
          </Button>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <Card>
          <CardHeader>
            <BrainCircuit className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Semantic Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Goes beyond simple keywords to interpret the true intent behind your prompts.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Sparkles className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Smart Summarization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Condenses massive documents and search results into exact, readable highlights.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ShieldCheck className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Role-Based Isolation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Your account type strings protect your search workspace parameters safely.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}