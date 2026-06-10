import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, 
  CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Globe, Cpu, Loader2, Link2 } from "lucide-react";
import { useSelector } from "react-redux";
import MarkdownRenderer from "@/components/Markdown";
import { Textarea } from "@/components/ui/textarea";

interface ChatExchange {
  question: string;
  answer: string;
  sources: string[];
  mode: "web" | "direct";
}

export default function App() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false); 
  const [history, setHistory] = useState<ChatExchange[]>([]);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const { id, email } = useSelector((state: any) => state.user.userInfo);

  // Smooth scroll to bottom on new history entries or loading indicators
  useEffect(() => {
    if (!chatRef.current) return;

    const scrollTimeout = setTimeout(() => {
      chatRef.current?.scrollIntoView({ 
        behavior: "smooth", 
        block: "end"
      });
    }, 100);

    return () => clearTimeout(scrollTimeout);
  }, [isLoading, history.length]);

  // Fetch initial history safely
  useEffect(() => {
    if (!id || !email) return;

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

        if (!response.ok) throw new Error("Backend search failed");
        
        const data: ChatExchange[] = await response.json();
        return data;
      } catch (error) {
        console.error("Error catching history:", error);
        return [];
      }
    };

    const loadData = async () => {
      setIsHistoryLoading(true);
      const data = await fetchHistory();
      // Safe non-mutating copy-reverse method
      setHistory([...data].reverse());
      setIsHistoryLoading(false);
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
        body: JSON.stringify({ q: currentQuery, id, email }),
      });

      if (!response.ok) throw new Error("Backend search failed");

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch(e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Dynamic Question & Answer History Container */}
      <div className="space-y-4">
        {history.map((exchange, index) => {
          const rawSources = exchange.sources || [];
          const normalizedSources: string[] = rawSources
            .map((s: any) => {
              if (typeof s === "string") return s;
              if (s && typeof s === "object" && s.url) return s.url;
              return "";
            })
            .filter((url) => url.length > 0);

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
                <div className="text-neutral-700 dark:text-neutral-300 leading-relaxed content-markdown">
                  <MarkdownRenderer>{exchange.answer}</MarkdownRenderer>
                </div>
                
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
                        } catch {}
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
        {(isLoading || isHistoryLoading) && (
          <Card className="border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/20 dark:bg-neutral-900/10">
            <CardContent className="py-8 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
              <p className="text-sm text-neutral-400 font-medium animate-pulse">
                {isHistoryLoading ? "Loading search history..." : "Analyzing query and drafting synthesis..."}
              </p>
            </CardContent>
          </Card>
        )}
        
        <div ref={chatRef} />

        {/* Search Input Card */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">AI Knowledge Engine</CardTitle>
            <CardDescription>
              Enter a query to get a direct answer or a fully synthesized web research brief.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                <Textarea
                  placeholder="Ask anything..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-9 pr-4 py-2 bg-neutral-50/50 dark:bg-neutral-900/50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-10 max-h-48 field-sizing:content"
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" disabled={isLoading} 
              className="min-w-full h-10 self-end lg:min-w-32">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}