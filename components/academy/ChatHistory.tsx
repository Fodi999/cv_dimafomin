'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  type?: 'recipe' | 'meal-idea' | 'technique' | 'learning-plan' | 'photo-check';
  content: string;
  cost?: number;
  timestamp: Date;
}

interface ChatMessageProps {
  message: ChatMessage;
  isLoading?: boolean;
}

export function ChatMessageComponent({ message, isLoading }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
          🤖
        </div>
      )}

      <div className={`max-w-2xl ${isUser ? 'order-2' : 'order-1'}`}>
        <Card
          className={`p-4 ${
            isUser
              ? 'bg-blue-600 text-white rounded-3xl rounded-tr-md'
              : 'bg-gray-100 text-gray-900 rounded-3xl rounded-tl-md'
          }`}
        >
          {isLoading ? (
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap break-words text-sm md:text-base leading-relaxed">
                {message.content}
              </div>
            </div>
          )}
        </Card>

        {!isUser && message.cost && (
          <div className="text-xs text-gray-500 mt-2 px-2">
            💎 Стоимость: {message.cost} CT
          </div>
        )}

        <div className="text-xs text-gray-500 mt-1 px-2">
          {message.timestamp.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold">
          👨‍🍳
        </div>
      )}
    </div>
  );
}

interface ChatHistoryProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function ChatHistory({ messages, isLoading }: ChatHistoryProps) {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto px-4 py-4">
      {messages.length === 0 && !isLoading && (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Chef Assistant</h3>
          <p className="text-gray-600 max-w-md">
            Начните разговор! Я помогу вам с рецептами, идеями для ужина, техниками приготовления и многим другим.
          </p>
        </div>
      )}

      {messages.map((message) => (
        <ChatMessageComponent key={message.id} message={message} />
      ))}

      {isLoading && messages.length > 0 && (
        <ChatMessageComponent
          message={{
            id: 'loading',
            role: 'assistant',
            content: '',
            timestamp: new Date(),
          }}
          isLoading={true}
        />
      )}
    </div>
  );
}
