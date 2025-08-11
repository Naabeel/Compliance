import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Search,
  ExternalLink,
  MessageSquare,
  Edit,
  Send,
  Loader2,
  UserCheck,
  FileText,
  AlertTriangle,
} from "lucide-react";

// Types
interface NetworkMember {
  name: string;
  biography: string;
  practice_area: string;
  council_name: string;
  country: string;
  linkedin_url: string;
  work_history: Array<{
    company: string;
    title: string;
    period: string;
  }>;
}

interface ScreeningStatus {
  nm_id: string;
  status: string;
  results?: {
    summary: string;
    citations: string[];
  };
}

interface ChatMessage {
  type: "user" | "agent";
  message: string;
  timestamp: Date;
}

// App States
type AppState = "landing" | "search" | "details" | "screening" | "results";

export default function Index() {
  // State management
  const [currentState, setCurrentState] = useState<AppState>("search");
  const [nmId, setNmId] = useState("");
  const [networkMember, setNetworkMember] = useState<NetworkMember | null>(
    null,
  );
  const [screeningStatus, setScreeningStatus] =
    useState<ScreeningStatus | null>(null);
  const [queries, setQueries] = useState<string[]>([]);
  const [showCitations, setShowCitations] = useState(false);
  const [showQueries, setShowQueries] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingQueries, setLoadingQueries] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState("");
  const [polling, setPolling] = useState(false);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom (removed as requested)
  // useEffect(() => {
  //   if (chatEndRef.current) {
  //     chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [chatMessages]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // API Functions
  const findNetworkMember = async () => {
    if (!nmId.trim()) {
      setError("Please enter a Network Member ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/get_nm_info/${nmId}`);

      if (!response.ok) {
        throw new Error("Network Member not found");
      }

      const data = await response.json();
      setNetworkMember(data);
      setCurrentState("details");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to find Network Member",
      );
    } finally {
      setLoading(false);
    }
  };

  const startScreening = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/start_screening");

      if (!response.ok) {
        throw new Error("Failed to start screening");
      }

      const data = await response.json();

      if (data.nm_id) {
        setCurrentState("screening");
        startPolling(data.nm_id);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start screening",
      );
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (pollNmId: string) => {
    setPolling(true);

    const poll = async () => {
      try {
        const response = await fetch(`/api/status/${pollNmId}`);
        const data = await response.json();

        setScreeningStatus(data);

        if (data.status.toLowerCase() === "completed") {
          setPolling(false);
          setCurrentState("results");
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    // Initial poll
    poll();

    // Set up interval
    pollIntervalRef.current = setInterval(poll, 3000); // Poll every 3 seconds
  };

  const loadQueries = async () => {
    if (!nmId) return;

    setLoadingQueries(true);
    setError("");

    try {
      // Add timestamp to prevent caching
      const response = await fetch(`/api/queries/${nmId}?t=${Date.now()}`);

      if (!response.ok) {
        throw new Error(`Failed to load queries: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Queries API Response:", data); // Debug log

      // Display all queries from response
      setQueries(data.queries || []);
      setShowQueries(true);

      // Add to section order if not already present
      setSectionOrder((prev) => {
        const newOrder = prev.filter((item) => item !== "queries");
        return ["queries", ...newOrder];
      });
    } catch (err) {
      console.error("Load queries error:", err);
      setError(err instanceof Error ? err.message : "Failed to load queries");
    } finally {
      setLoadingQueries(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !nmId || loadingChat) return;

    const userMessage: ChatMessage = {
      type: "user",
      message: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const currentQuery = chatInput;
    setChatInput("");
    setLoadingChat(true);

    try {
      const response = await fetch("/api/answer_query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nm_id: nmId,
          user_query: currentQuery,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Chat API Response:", data);

      let agentResponse = "";
      if (data.answer) {
        agentResponse = data.answer;
      } else {
        agentResponse = "I apologize, but I could not process your request.";
        console.warn("No answer field in response:", data);
      }

      const agentMessage: ChatMessage = {
        type: "agent",
        message: agentResponse,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      console.error("Chat API error:", err);
      const errorMessage: ChatMessage = {
        type: "agent",
        message: `Sorry, I encountered an error: ${err instanceof Error ? err.message : "Unknown error"}`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoadingChat(false);
    }
  };

  const goBack = () => {
    if (currentState === "details") {
      setCurrentState("search");
      setNetworkMember(null);
      setError("");
    } else if (currentState === "screening" || currentState === "results") {
      setCurrentState("details");
      setScreeningStatus(null);
      setQueries([]);
      setShowCitations(false);
      setShowQueries(false);
      setShowChat(false);
      setChatMessages([]);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    }
  };

  const resetToSearch = () => {
    setCurrentState("search");
    setNmId("");
    setNetworkMember(null);
    setScreeningStatus(null);
    setQueries([]);
    setShowCitations(false);
    setShowQueries(false);
    setShowChat(false);
    setChatMessages([]);
    setError("");
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-compliance-header text-compliance-header-foreground shadow-sm">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-4">
              {currentState !== "search" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={goBack}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
            <h1
              className="text-lg lg:text-xl font-semibold text-center cursor-pointer"
              onClick={resetToSearch}
            >
              GLG Compliance Agent
            </h1>
            <div className="w-16 lg:w-32"></div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main
          className={`${showChat ? "flex-1" : "w-full"} p-4 lg:p-6 transition-all duration-300`}
        >
          <div className="max-w-4xl mx-auto">
            {/* Search Screen */}
            {currentState === "search" && (
              <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle className="text-center">
                      Find Network Member
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nm_id">Network Member ID</Label>
                      <Input
                        id="nm_id"
                        value={nmId}
                        onChange={(e) => setNmId(e.target.value)}
                        placeholder="Enter NM ID..."
                        onKeyPress={(e) =>
                          e.key === "Enter" && findNetworkMember()
                        }
                      />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <Button
                      onClick={findNetworkMember}
                      disabled={loading}
                      className="w-full bg-compliance-header hover:bg-compliance-accent"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4 mr-2" />
                      )}
                      Find NM
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Network Member Details Screen */}
            {currentState === "details" && networkMember && (
              <div className="space-y-6">
                <h2 className="text-xl lg:text-2xl font-semibold text-compliance-header">
                  Network Member Details
                </h2>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Name
                      </Label>
                      <p className="text-lg font-semibold">
                        {networkMember.name}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Biography
                      </Label>
                      <p className="text-sm text-gray-700">
                        {networkMember.biography.length > 200
                          ? `${networkMember.biography.substring(0, 200)}...`
                          : networkMember.biography}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Practice Area
                        </Label>
                        <p className="text-sm">{networkMember.practice_area}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Council Name
                        </Label>
                        <p className="text-sm">{networkMember.council_name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Country
                        </Label>
                        <p className="text-sm">{networkMember.country}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          LinkedIn
                        </Label>
                        <a
                          href={networkMember.linkedin_url}
                          className="text-sm text-compliance-accent hover:underline flex items-center"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Profile <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600 mb-2 block">
                        Work History
                      </Label>
                      <div className="space-y-2">
                        {networkMember.work_history
                          .slice(0, 3)
                          .map((job, index) => (
                            <div
                              key={index}
                              className="border-l-2 border-gray-200 pl-3"
                            >
                              <p className="text-sm font-medium">
                                {job.company}
                              </p>
                              <p className="text-xs text-gray-600">
                                {job.title} • {job.period}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        onClick={startScreening}
                        disabled={loading}
                        className="w-full bg-compliance-header hover:bg-compliance-accent"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        Start Screening
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Screening in Progress Screen */}
            {currentState === "screening" && (
              <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="w-full max-w-md">
                  <CardContent className="p-6 text-center space-y-4">
                    <Loader2 className="h-12 w-12 mx-auto animate-spin text-compliance-header" />
                    <h3 className="text-lg font-semibold">
                      Screening in Progress
                    </h3>
                    <p className="text-sm text-gray-600">
                      {screeningStatus?.status || "Initializing screening..."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Results Screen */}
            {currentState === "results" && screeningStatus?.results && (
              <div className="space-y-6">
                <h2 className="text-xl lg:text-2xl font-semibold text-compliance-header">
                  Screening Results for {networkMember?.name}
                </h2>

                {/* Action Buttons - Single Set */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button
                    variant="outline"
                    onClick={loadQueries}
                    disabled={loadingQueries}
                    className="flex items-center justify-center space-x-2"
                  >
                    {loadingQueries ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    <span>
                      {loadingQueries ? "Loading..." : "View Queries"}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCitations(!showCitations);
                      if (!showCitations) {
                        // Add to section order if not already present
                        setSectionOrder((prev) => {
                          const newOrder = prev.filter(
                            (item) => item !== "citations",
                          );
                          return ["citations", ...newOrder];
                        });
                      }
                    }}
                    className="flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Citations</span>
                  </Button>
                  <Button
                    onClick={() => setShowChat(!showChat)}
                    className="bg-compliance-header hover:bg-compliance-accent text-white flex items-center justify-center space-x-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Start a Conversation</span>
                  </Button>
                </div>

                {/* Dynamic Sections - Show in order of clicks */}
                {sectionOrder.map((section) => {
                  if (
                    section === "citations" &&
                    showCitations &&
                    screeningStatus?.results?.citations
                  ) {
                    return (
                      <Card key="citations">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>
                            Citations (
                            {screeningStatus.results.citations.length})
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowCitations(false);
                              setSectionOrder((prev) =>
                                prev.filter((item) => item !== "citations"),
                              );
                            }}
                          >
                            ×
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-64">
                            <div className="space-y-2">
                              {screeningStatus.results.citations.map(
                                (citation, index) => (
                                  <div
                                    key={index}
                                    className="p-3 bg-gray-50 rounded border"
                                  >
                                    <div className="text-xs text-gray-500 mb-1">
                                      Citation {index + 1}
                                    </div>
                                    <a
                                      href={citation}
                                      className="text-sm text-compliance-accent hover:underline flex items-center break-all"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {citation}{" "}
                                      <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                                    </a>
                                  </div>
                                ),
                              )}
                            </div>
                          </ScrollArea>
                          <div className="mt-4 text-xs text-gray-500">
                            Total citations:{" "}
                            {screeningStatus.results.citations.length}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }

                  if (section === "queries" && showQueries) {
                    return (
                      <Card key="queries">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>
                            Generated Queries ({queries.length})
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowQueries(false);
                              setSectionOrder((prev) =>
                                prev.filter((item) => item !== "queries"),
                              );
                            }}
                          >
                            ×
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-64">
                            <div className="space-y-2">
                              {queries.map((query, index) => (
                                <div
                                  key={index}
                                  className="flex items-start justify-between p-3 bg-gray-50 rounded border"
                                >
                                  <div className="flex-1">
                                    <div className="text-xs text-gray-500 mb-1">
                                      Query {index + 1}
                                    </div>
                                    <span className="text-sm break-words">
                                      {query}
                                    </span>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2 flex-shrink-0"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                          <div className="mt-4 text-xs text-gray-500">
                            Total queries: {queries.length} | Click 'Edit' to
                            modify queries (functionality coming soon)
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }

                  return null;
                })}

                {/* Screening Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Screening Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {screeningStatus?.results?.summary ? (
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: screeningStatus.results.summary,
                        }}
                      />
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <p>No summary data available</p>
                        <p className="text-xs mt-2">
                          This may indicate an issue with the API response
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {error && currentState !== "search" && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </main>

        {/* Chat Sidebar - Fixed Height */}
        {showChat && (
          <div className="w-80 bg-white border-l shadow-lg flex flex-col h-[calc(100vh-80px)]">
            <div className="p-4 border-b bg-compliance-header text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Chat with Agent</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={() => setShowChat(false)}
                >
                  ×
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-gray-500 text-sm">
                      Ask me anything about {networkMember?.name}'s screening
                      results.
                    </div>
                  )}
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          msg.type === "user"
                            ? "bg-compliance-header text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t flex-shrink-0">
                <div className="flex space-x-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your question..."
                    onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                  />
                  <Button
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim() || loadingChat}
                    size="sm"
                    className="bg-compliance-header hover:bg-compliance-accent"
                  >
                    {loadingChat ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
