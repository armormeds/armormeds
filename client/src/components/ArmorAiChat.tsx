import { useState, useRef, useEffect } from "react";
import { X, MessageCircle, Send, Loader2, ChevronDown, Bot } from "lucide-react";
import { useLocation } from "wouter";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm **Armor AI**, your ArmorMeds health assistant. I can answer questions about our weight management, hair loss, and sexual health treatments.\n\nWhat would you like to know?",
};

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

export function ArmorAiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [location] = useLocation();

  const isStandalonePage =
    location.startsWith("/admin") || location.startsWith("/patient");
  if (isStandalonePage) return null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    const assistantMessage: Message = {
      role: "assistant",
      content: "",
      streaming: true,
    };
    setMessages([...updatedMessages, assistantMessage]);

    try {
      const response = await fetch("/api/armor-ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to Armor AI");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullContent += data.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: fullContent,
                    streaming: true,
                  };
                  return updated;
                });
              }
              if (data.done) {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: fullContent,
                    streaming: false,
                  };
                  return updated;
                });
              }
            } catch {
            }
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
          streaming: false,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {isOpen && (
          <div
            className="w-[360px] max-h-[520px] flex flex-col rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden"
            style={{ maxHeight: "min(520px, calc(100vh - 120px))" }}
            onClick={(e) => e.stopPropagation()}
            data-testid="armor-ai-chat-panel"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#1a3c5e] to-[#2d6a9f] text-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm leading-tight">Armor AI</div>
                  <div className="text-[10px] text-white/70 leading-tight">ArmorMeds Health Assistant</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                data-testid="armor-ai-close-btn"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`armor-ai-message-${i}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-[#1a3c5e] flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                      <Bot size={12} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#2d6a9f] text-white rounded-tr-sm"
                        : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderMarkdown(msg.content),
                          }}
                        />
                        {msg.streaming && (
                          <span className="inline-block w-1.5 h-3.5 bg-gray-400 ml-0.5 animate-pulse rounded-sm align-middle" />
                        )}
                      </>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.content === "" && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-full bg-[#1a3c5e] flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot size={12} className="text-white" />
                  </div>
                  <div className="bg-white px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                    <div className="flex gap-1 items-center h-4">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-3 py-3 bg-white border-t border-gray-100 flex-shrink-0">
              <div className="flex gap-2 items-center bg-gray-50 rounded-xl border border-gray-200 px-3 py-1.5 focus-within:border-[#2d6a9f] focus-within:ring-1 focus-within:ring-[#2d6a9f]/20 transition-all">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about our treatments..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none disabled:opacity-50"
                  data-testid="armor-ai-input"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="w-7 h-7 rounded-lg bg-[#2d6a9f] disabled:bg-gray-200 hover:bg-[#1a3c5e] flex items-center justify-center transition-colors flex-shrink-0"
                  data-testid="armor-ai-send-btn"
                >
                  {isLoading ? (
                    <Loader2 size={13} className="text-white animate-spin" />
                  ) : (
                    <Send size={13} className="text-white" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-1.5">
                Not a substitute for medical advice
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 relative ${
            isOpen
              ? "bg-gray-700 hover:bg-gray-800"
              : "bg-gradient-to-br from-[#1a3c5e] to-[#2d6a9f] hover:from-[#2d6a9f] hover:to-[#1a3c5e]"
          }`}
          data-testid="armor-ai-toggle-btn"
          aria-label="Open Armor AI Chat"
        >
          {isOpen ? (
            <ChevronDown size={22} className="text-white" />
          ) : (
            <MessageCircle size={22} className="text-white" />
          )}
          {!isOpen && hasUnread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white" />
            </span>
          )}
        </button>
      </div>
    </>
  );
}
