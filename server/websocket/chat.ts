import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { parse } from "url";
import { verify } from "jsonwebtoken";
import { prisma } from "../db";

interface ChatClient {
  id: string;
  ws: WebSocket;
  userId: number;
  role: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
  recipientId?: string;
  status?: "sending" | "sent" | "error";
}

interface TypingIndicator {
  type: "typing";
  isTyping: boolean;
  userId: number;
}

const clients = new Map<string, ChatClient>();
const supportAgents = new Map<string, ChatClient>();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function handleChatConnection(ws: WebSocket, req: IncomingMessage) {
  try {
    const { userId, role } = await validateSession(req);
    if (!userId) {
      ws.close(1008, "Unauthorized");
      return;
    }

    const clientId = Math.random().toString(36).substring(7);
    const client: ChatClient = { id: clientId, ws, userId, role };

    // Add client to appropriate map
    if (role === "SUPPORT") {
      supportAgents.set(clientId, client);
      // Notify support agent of all active user chats
      sendActiveChats(client);
    } else {
      clients.set(clientId, client);
    }

    // Send welcome message
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      text: "Welcome to live chat! An agent will be with you shortly.",
      sender: "support",
      timestamp: new Date(),
      status: "sent"
    };
    ws.send(JSON.stringify(welcomeMessage));

    // Handle incoming messages
    ws.on("message", async (data: string) => {
      try {
        const message = JSON.parse(data);
        
        // Handle typing indicators
        if (message.type === "typing") {
          handleTypingIndicator(message as TypingIndicator, client);
          return;
        }

        // Handle chat messages
        const chatMessage = message as ChatMessage;
        
        // If the message is from a support agent
        if (role === "SUPPORT") {
          const targetClient = clients.get(chatMessage.recipientId || "");
          if (targetClient) {
            const formattedMessage = {
              ...chatMessage,
              sender: "support",
              status: "sent"
            };
            targetClient.ws.send(JSON.stringify(formattedMessage));
            // Send delivery confirmation back to support agent
            ws.send(JSON.stringify({
              ...formattedMessage,
              status: "sent",
              recipientId: targetClient.userId
            }));
          }
        }
        // If the message is from a regular user
        else {
          // Find least busy support agent
          const agent = findAvailableAgent();
          if (agent) {
            const formattedMessage = {
              ...chatMessage,
              sender: "user",
              userId: userId,
              status: "sent"
            };
            agent.ws.send(JSON.stringify(formattedMessage));
            // Send delivery confirmation back to user
            ws.send(JSON.stringify({
              ...formattedMessage,
              status: "sent"
            }));
          } else {
            // No support agents available
            ws.send(JSON.stringify({
              id: Date.now().toString(),
              text: "No support agents are currently available. Please try again later.",
              sender: "support",
              timestamp: new Date(),
              status: "sent"
            }));
          }
        }

        // Store message in database
        await storeMessage(chatMessage, userId, role);

      } catch (error) {
        console.error("Error handling message:", error);
        ws.send(JSON.stringify({
          id: Date.now().toString(),
          text: "Error processing message. Please try again.",
          sender: "support",
          timestamp: new Date(),
          status: "error"
        }));
      }
    });

    // Handle client disconnection
    ws.on("close", () => {
      if (role === "SUPPORT") {
        supportAgents.delete(clientId);
      } else {
        clients.delete(clientId);
        // Notify support agents that user has disconnected
        notifySupportAgentsOfDisconnection(userId);
      }
    });

    // Handle errors
    ws.on("error", (error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
      ws.close();
    });

  } catch (error) {
    console.error("Error in chat connection:", error);
    ws.close(1011, "Internal Server Error");
  }
}

async function validateSession(req: IncomingMessage) {
  try {
    const url = parse(req.url || "", true);
    const token = url.query.token as string;
    
    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = verify(token, JWT_SECRET) as { userId: number; role: string };
    
    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      userId: decoded.userId,
      role: decoded.role
    };
  } catch (error) {
    console.error("Session validation error:", error);
    throw error;
  }
}

function handleTypingIndicator(indicator: TypingIndicator, client: ChatClient) {
  if (client.role === "SUPPORT") {
    // Send typing indicator to specific user
    const targetClient = clients.get(indicator.userId.toString());
    if (targetClient) {
      targetClient.ws.send(JSON.stringify(indicator));
    }
  } else {
    // Send typing indicator to all support agents
    supportAgents.forEach(agent => {
      agent.ws.send(JSON.stringify({
        ...indicator,
        userId: client.userId
      }));
    });
  }
}

function findAvailableAgent(): ChatClient | undefined {
  // Find agent with least active chats
  let selectedAgent: ChatClient | undefined;
  let minChats = Infinity;

  supportAgents.forEach(agent => {
    const activeChats = Array.from(clients.values())
      .filter(client => client.lastMessageAgent === agent.id)
      .length;

    if (activeChats < minChats) {
      minChats = activeChats;
      selectedAgent = agent;
    }
  });

  return selectedAgent;
}

async function storeMessage(message: ChatMessage, userId: number, role: string) {
  try {
    await prisma.chatMessage.create({
      data: {
        messageId: message.id,
        text: message.text,
        sender: role,
        userId: userId,
        recipientId: message.recipientId ? parseInt(message.recipientId) : null,
        timestamp: message.timestamp
      }
    });
  } catch (error) {
    console.error("Error storing message:", error);
  }
}

function sendActiveChats(agent: ChatClient) {
  clients.forEach(client => {
    agent.ws.send(JSON.stringify({
      type: "active_chat",
      userId: client.userId,
      timestamp: new Date()
    }));
  });
}

function notifySupportAgentsOfDisconnection(userId: number) {
  supportAgents.forEach(agent => {
    agent.ws.send(JSON.stringify({
      type: "user_disconnected",
      userId: userId,
      timestamp: new Date()
    }));
  });
}

// Export types for use in other files
export type { ChatMessage, ChatClient, TypingIndicator }; 