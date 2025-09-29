'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText, Loader2, Filter } from 'lucide-react';
import Button from '../ui/Button';
import DocumentSelector from './DocumentSelector';

interface ChatMessage {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  context_documents?: Array<{
    document_id: number;
    title: string;
    excerpt: string;
    similarity_score: number;
    file_type: string;
  }>;
  created_at?: string;
}

interface ChatInterfaceProps {
  conversationId?: number;
  onNewConversation?: (conversationId: number) => void;
  className?: string;
}

export default function ChatInterface({ 
  conversationId, 
  onNewConversation,
  className = "" 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<number[]>([]);
  const [isDocumentSelectorOpen, setIsDocumentSelectorOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load conversation messages when conversationId changes
  useEffect(() => {
    if (conversationId) {
      loadConversationMessages(conversationId);
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversationMessages = async (convId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations/${convId}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const messagesData = await response.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load conversation messages');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage.trim(),
      created_at: new Date().toISOString(),
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_id: conversationId,
          selected_document_ids: selectedDocumentIds.length > 0 ? selectedDocumentIds : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const chatResponse = await response.json();

      // Create assistant message
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: chatResponse.message,
        context_documents: chatResponse.context_documents,
        created_at: new Date().toISOString(),
      };

      // Add assistant response to messages
      setMessages(prev => [...prev, assistantMessage]);

      // If this was a new conversation, update the conversation ID
      if (!conversationId && onNewConversation) {
        onNewConversation(chatResponse.conversation_id);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      // Remove the user message that failed to send
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 ${className}`}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <Bot className="mx-auto mb-4 h-12 w-12" />
            <p className="text-lg font-medium">Ask me anything about your documents!</p>
            <p className="text-sm mt-2">I'll search through your knowledge base to provide relevant answers.</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white ml-2'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mr-2'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Message Content */}
              <div className="flex flex-col">
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>

                {/* Context Documents */}
                {message.context_documents && message.context_documents.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Sources ({message.context_documents.length}):
                    </p>
                    {message.context_documents.map((doc, docIndex) => (
                      <div
                        key={docIndex}
                        className="flex items-start space-x-2 text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded border"
                      >
                        <FileText className="w-3 h-3 mt-0.5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            {doc.title}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
                            {doc.excerpt}
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 mt-1">
                            Relevance: {(doc.similarity_score * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                {message.created_at && (
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTimestamp(message.created_at)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mr-2 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-gray-600 dark:text-gray-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        {/* Document Selection Info */}
        {selectedDocumentIds.length > 0 && (
          <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Searching in {selectedDocumentIds.length} selected document{selectedDocumentIds.length === 1 ? '' : 's'}
                </span>
              </div>
              <button
                onClick={() => setSelectedDocumentIds([])}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                Clear selection
              </button>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            onClick={() => setIsDocumentSelectorOpen(true)}
            variant="outline"
            className="px-3 py-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            title="Select documents to search in"
          >
            <Filter className="w-4 h-4" />
          </Button>
          
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              selectedDocumentIds.length > 0 
                ? `Ask about your ${selectedDocumentIds.length} selected document${selectedDocumentIds.length === 1 ? '' : 's'}...`
                : "Ask a question about your documents..."
            }
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>

      {/* Document Selector Modal */}
      <DocumentSelector
        isOpen={isDocumentSelectorOpen}
        onClose={() => setIsDocumentSelectorOpen(false)}
        selectedDocumentIds={selectedDocumentIds}
        onSelectionChange={setSelectedDocumentIds}
      />
    </div>
  );
}
