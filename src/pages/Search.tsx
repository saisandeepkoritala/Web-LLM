import React, { useState,useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, 
  CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Globe, Cpu, Loader2, Link2 } from "lucide-react";
import { useSelector } from "react-redux";

interface ChatExchange {
  question: string;
  answer: string;
  sources: string[];
  mode: "web" | "direct";
}

export default function App() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ChatExchange[]>([]);
  const chatRef = useRef<HTMLDivElement|null>(null);
  const {id,email} = useSelector((state:any)=>state.user.userInfo);

  useEffect(() => {
  if (chatRef.current) {
    chatRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [isLoading, history]);

  useEffect(() => {
   
    const fetchHistory = async (): Promise<ChatExchange[]> => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL_PROD}/api/v1/fetchUserHistory`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id, email }), 
        });

        if (!response.ok) {
          throw new Error("Backend search failed");
        }

        const data: ChatExchange[] = await response.json();
        return data;
      } catch (error) {
        console.error("Error catching history:", error);
        return [];
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchHistory(); 
      setHistory(data.reverse());              
      setIsLoading(false);
    };

    loadData();
  }, [id, email]); 

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const currentQuery = query.trim();
    setQuery(""); 
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL_PROD}/api/v1/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ q: currentQuery }),
      });

      if (!response.ok) {
        throw new Error("Backend search failed");
      }

      const data = await response.json();

      setHistory((prev) => [
        ...prev,
        {
          question: currentQuery,
          answer: data.answer,
          sources: data.sources || [],
          mode: data.mode,
        },
      ]);
    } catch (error) {
      console.error("Search Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      
      {/* Dynamic Question & Answer History Container */}
    <div className="space-y-4">
      {history.map((exchange, index) => {
        const rawSources = exchange.sources || [];
        const normalizedSources: string[] = rawSources.map((s: any) => {
          if (typeof s === "string") return s;
          if (s && typeof s === "object" && s.url) return s.url;
          return "";
        }).filter((url) => url.length > 0);

        return (
          <Card key={index} className="overflow-hidden border-neutral-200 dark:border-neutral-800">
            {/* Question Header Row */}
            <div className="bg-neutral-50 dark:bg-neutral-900/40 px-6 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/60">
              <h3 className="font-medium text-neutral-800 dark:text-neutral-200">
                Q: {exchange.question}
              </h3>
              <Badge 
                variant={exchange.mode === "web" ? "default" : "secondary"}
                className="flex items-center gap-1 text-xs"
              >
                {exchange.mode === "web" ? (
                  <>
                    <Globe className="h-3 w-3" /> Web Search
                  </>
                ) : (
                  <>
                    <Cpu className="h-3 w-3" /> Direct LLM
                  </>
                )}
              </Badge>
            </div>

            {/* Answer Content Block */}
            <CardContent className="pt-5 pb-6 space-y-4">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {exchange.answer}
              </p>
              {normalizedSources.length > 0 && (
                <div className="space-y-2 pt-2">
                  <Separator className="bg-neutral-100 dark:bg-neutral-800" />
                  <div className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
                    Sources Verified
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {normalizedSources.map((url, sIdx) => {
                      let hostname = url;
                      try {
                        hostname = new URL(url).hostname;
                      } catch {
                      
                      }
                      return (
                        <a
                          key={sIdx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors border border-neutral-200/40 dark:border-neutral-700/40"
                        >
                          <Link2 className="h-3 w-3 text-neutral-400" />
                          {hostname}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

       {/* Inline Active Loader UI */}
      {isLoading && (
        <Card className="border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/20 dark:bg-neutral-900/10">
          <CardContent className="py-8 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
            <p className="text-sm text-neutral-400 font-medium animate-pulse">
              Analyzing query and drafting synthesis...
            </p>
          </CardContent>
        </Card>
      )}
      <div ref={chatRef}/>

      {/* Search Header and Input Form */}
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">AI Knowledge Engine</CardTitle>
          <CardDescription>
            Enter a query to get a direct answer or a fully synthesized web research brief.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Ask anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 bg-neutral-50/50 dark:bg-neutral-900/50 "
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="min-w-22.5">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

  
    </div>
    </div>
  );
}