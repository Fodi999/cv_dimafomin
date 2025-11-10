// useChat.ts - Hook for managing AI chat session and messages

import { useState, useEffect, useCallback } from "react";

interface ChatMessage {
  role: "ai" | "user";
  content: string;
  timestamp: number;
}

interface UseChatOptions {
  language?: string;
  autoInitialize?: boolean;
}

interface AIResponse {
  message?: string;
  sessionId?: string;
  isComplete?: boolean;
  recipe?: any;
}

interface UseChatReturn {
  // State
  chatMessages: ChatMessage[];
  sessionId: string | null;
  isAIThinking: boolean;
  
  // Actions
  sendMessage: (message: string, imageData?: string | null) => Promise<AIResponse | undefined>;
  initializeChat: () => Promise<void>;
  addUserMessage: (content: string) => void;
  addAIMessage: (content: string) => void;
  resetChat: () => void;
}

const API_BASE_URL = "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/ai/chef-mentor";

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { language = "ua", autoInitialize = false } = options;
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const addAIMessage = useCallback((content: string | any) => {
    // If content is object, extract message
    let messageText = content;
    
    if (typeof content === "object" && content !== null) {
      console.warn("WARNING: AI message is object, extracting text:", content);
      messageText = content.message || JSON.stringify(content, null, 2);
    }
    
    // If message is JSON string, parse it
    if (typeof messageText === "string" && messageText.startsWith("{")) {
      try {
        const parsed = JSON.parse(messageText);
        if (parsed.message) {
          console.log("JSON string parsed to extract message");
          messageText = parsed.message;
        }
      } catch (e) {
        // Not a JSON string, keep as is
      }
    }
    
    console.log("Adding AI message:", messageText);
    
    setChatMessages(prev => [...prev, {
      role: "ai",
      content: messageText,
      timestamp: Date.now()
    }]);
  }, []);

  const addUserMessage = useCallback((content: string) => {
    setChatMessages(prev => [...prev, {
      role: "user",
      content,
      timestamp: Date.now()
    }]);
  }, []);

  const initializeChat = useCallback(async () => {
    setIsAIThinking(true);
    try {
      const response = await fetch(`${API_BASE_URL}/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Початок",
          language: language
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Failed to parse initialization response:", e);
        addAIMessage("Привіт! Розкажіть, яку страву хочете приготувати?");
        return;
      }
      
      console.log("Initialize Response:", JSON.stringify(data, null, 2));
      
      // Support both response formats
      let aiData;
      if (data.status === "success" && data.data) {
        aiData = data.data;
        console.log("Init Format 1: {status, data}");
      } else if (data.message) {
        aiData = data;
        console.log("Init Format 2: Direct object");
      } else {
        console.error("Unknown init format:", data);
        addAIMessage("Привіт! Розкажіть, яку страву хочете приготувати?");
        return;
      }
      
      if (aiData.sessionId) {
        setSessionId(aiData.sessionId);
      }
      
      if (aiData.message) {
        addAIMessage(aiData.message);
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
      addAIMessage("Привіт! Розкажіть, яку страву хочете приготувати?");
    } finally {
      setIsAIThinking(false);
    }
  }, [language, addAIMessage]);

  const sendMessage = useCallback(async (message: string, imageData?: string | null) => {
    if (!message.trim() || isAIThinking) return;

    addUserMessage(message);
    setIsAIThinking(true);

    try {
      const response = await fetch(`${API_BASE_URL}/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          message: message,
          image: imageData,
          language: language
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Failed to parse message response:", e);
        addAIMessage("Вибачте, сталася помилка. Спробуйте ще раз");
        return;
      }

      console.log("RAW AI Response:", JSON.stringify(data, null, 2));

      // Backend can return different structures
      let aiData;
      
      if (data.status === "success" && data.data) {
        aiData = data.data;
        console.log("Format 1: {status, data}");
      } else if (data.message) {
        aiData = data;
        console.log("Format 2: Direct object");
      } else {
        console.error("Unknown format:", data);
        addAIMessage("Вибачте, сталася помилка. Спробуйте ще раз");
        return;
      }
      
      console.log("Extracted message:", aiData.message);
      
      // Extract sessionId
      if (aiData.sessionId && aiData.sessionId !== sessionId) {
        setSessionId(aiData.sessionId);
        console.log("Session ID updated:", aiData.sessionId);
      }

      // Only add AI message if recipe is NOT complete
      if (!aiData.isComplete && aiData.message) {
        addAIMessage(aiData.message);
      }

      // Return the full response data so components can handle recipe completion
      return aiData;
      
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      let errorMessage = "Could not get response. Check your connection.";
      if (error.message?.includes("AI service error")) {
        errorMessage = "AI service temporarily unavailable. Please try again in a minute.";
      }
      
      addAIMessage(errorMessage);
    } finally {
      setIsAIThinking(false);
    }
  }, [sessionId, isAIThinking, language, addUserMessage, addAIMessage]);

  const resetChat = useCallback(() => {
    setChatMessages([]);
    setSessionId(null);
    setIsAIThinking(false);
  }, []);

  // Auto-initialize if requested
  useEffect(() => {
    if (autoInitialize) {
      initializeChat();
    }
  }, [autoInitialize, initializeChat]);

  return {
    chatMessages,
    sessionId,
    isAIThinking,
    sendMessage,
    initializeChat,
    addUserMessage,
    addAIMessage,
    resetChat,
  };
}
