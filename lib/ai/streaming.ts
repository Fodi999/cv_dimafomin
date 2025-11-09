// streaming.ts - Утиліти для роботи з AI streaming (для майбутнього)

/**
 * Парсить SSE (Server-Sent Events) stream
 */
export async function* parseSSEStream(
  response: Response
): AsyncGenerator<string, void, unknown> {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error("No response body");
  }

  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      
      // Keep last incomplete line in buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") {
            return;
          }
          yield data;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Обробляє streaming відповідь від AI
 */
export async function* streamAIResponse(
  request: {
    sessionId?: string | null;
    message: string;
    image?: string | null;
    language?: string;
  }
): AsyncGenerator<{ type: "token" | "complete"; data: any }, void, unknown> {
  const response = await fetch(
    "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/ai/chef-mentor/stream",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error(`Streaming error: ${response.status}`);
  }

  for await (const chunk of parseSSEStream(response)) {
    try {
      const parsed = JSON.parse(chunk);
      
      if (parsed.type === "token") {
        yield { type: "token", data: parsed.token };
      } else if (parsed.type === "complete") {
        yield { type: "complete", data: parsed.data };
        return;
      }
    } catch (e) {
      console.error("Failed to parse streaming chunk:", chunk);
    }
  }
}

/**
 * Хук для використання streaming в React
 */
export interface StreamingMessage {
  role: "ai" | "user";
  content: string;
  isStreaming?: boolean;
  timestamp: number;
}

export class AIStreamManager {
  private abortController: AbortController | null = null;

  async startStream(
    request: {
      sessionId?: string | null;
      message: string;
      image?: string | null;
      language?: string;
    },
    onToken: (token: string) => void,
    onComplete: (data: any) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    // Cancel previous stream if exists
    this.cancelStream();
    
    this.abortController = new AbortController();

    try {
      for await (const event of streamAIResponse(request)) {
        if (this.abortController.signal.aborted) {
          break;
        }

        if (event.type === "token") {
          onToken(event.data);
        } else if (event.type === "complete") {
          onComplete(event.data);
        }
      }
    } catch (error) {
      if (!this.abortController.signal.aborted) {
        onError(error as Error);
      }
    } finally {
      this.abortController = null;
    }
  }

  cancelStream(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  isStreaming(): boolean {
    return this.abortController !== null;
  }
}

/**
 * Utility для накопичення streaming tokens
 */
export class TokenAccumulator {
  private tokens: string[] = [];
  private fullText: string = "";

  addToken(token: string): void {
    this.tokens.push(token);
    this.fullText += token;
  }

  getText(): string {
    return this.fullText;
  }

  getTokens(): string[] {
    return [...this.tokens];
  }

  clear(): void {
    this.tokens = [];
    this.fullText = "";
  }

  getTokenCount(): number {
    return this.tokens.length;
  }
}
