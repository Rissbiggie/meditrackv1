import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
  status?: "sending" | "sent" | "error";
  recipientId?: string;
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getWebSocketUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const token = localStorage.getItem('token'); // Get auth token
    return `${protocol}//${window.location.host}/ws/chat?token=${token}`;
  };

  const connectToChat = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    setIsConnecting(true);
    try {
      const ws = new WebSocket(getWebSocketUrl());

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setReconnectAttempts(0);
        wsRef.current = ws;
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'typing') {
          setIsTyping(message.isTyping);
        } else {
          setMessages(prev => [...prev, message]);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;
        handleReconnect();
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnecting(false);
        setIsConnected(false);
        wsRef.current = null;
        toast({
          title: "Connection Error",
          description: "Failed to connect to chat. Retrying...",
          variant: "destructive",
        });
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setIsConnecting(false);
      handleReconnect();
    }
  };

  const handleReconnect = () => {
    if (reconnectAttempts >= 5) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to chat after multiple attempts. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
    reconnectTimeoutRef.current = setTimeout(() => {
      setReconnectAttempts(prev => prev + 1);
      connectToChat();
    }, timeout);
  };

  const disconnectFromChat = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  };

  useEffect(() => {
    if (isOpen && !isConnected && !isConnecting) {
      connectToChat();
    }
    return () => {
      disconnectFromChat();
    };
  }, [isOpen]);

  const sendMessage = () => {
    if (!newMessage.trim() || !wsRef.current) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
      status: "sending"
    };

    try {
      wsRef.current.send(JSON.stringify(message));
      setMessages(prev => [...prev, message]);
      setNewMessage("");

      // Update message status to sent after confirmation
      setTimeout(() => {
        setMessages(prev => 
          prev.map(m => m.id === message.id ? { ...m, status: "sent" } : m)
        );
      }, 500);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => 
        prev.map(m => m.id === message.id ? { ...m, status: "error" } : m)
      );
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectFromChat();
    };
  }, []);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 h-12 w-12 rounded-full bg-secondary shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-20 right-4 w-80 shadow-lg bg-white/10 backdrop-blur-sm border-none">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div>
          <h3 className="font-semibold text-white">Live Chat</h3>
          <p className="text-sm text-white/60">
            {isConnected ? "Connected" : isConnecting ? "Connecting..." : "Disconnected"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/60 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex flex-col max-w-[80%] space-y-1",
              message.sender === "user" ? "ml-auto items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "rounded-lg px-3 py-2",
                message.sender === "user"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-white/5 text-white"
              )}
            >
              {message.text}
              {message.status === "sending" && (
                <span className="ml-2 text-xs opacity-50">Sending...</span>
              )}
              {message.status === "error" && (
                <span className="ml-2 text-xs text-red-500">Failed to send</span>
              )}
            </div>
            <span className="text-xs text-white/40">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-white/60">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Agent is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {isConnecting && (
        <div className="p-4 text-center text-white/60">
          <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
          Connecting... Attempt {reconnectAttempts + 1}/5
        </div>
      )}

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border-none text-white"
            disabled={!isConnected}
          />
          <Button
            onClick={sendMessage}
            disabled={!isConnected}
            size="icon"
            className="bg-secondary text-secondary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
} 