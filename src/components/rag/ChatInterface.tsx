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
    <div className={`flex flex-col h-full ${className}`}>
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Bot className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ask questions about your documents</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-full p-6 w-20 h-20 mx-auto mb-6">
              <Bot className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Ready to help!</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Ask me anything about your documents. I'll search through your knowledge base to provide relevant and accurate answers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 max-w-lg mx-auto">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">💡 Try asking:</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">"Summarize my research notes"</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">🔍 Or search:</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">"Find information about..."</p>
              </div>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[85%] ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                  message.role === 'user'
                    ? 'bg-red-600 text-white ml-3'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 mr-3'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>

              {/* Message Content */}
              <div className="flex flex-col">
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    message.role === 'user'
                      ? 'bg-red-600 text-white rounded-br-md'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                </div>

                {/* Context Documents */}
                {message.context_documents && message.context_documents.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      📚 Sources ({message.context_documents.length})
                    </p>
                    <div className="space-y-2">
                      {message.context_documents.map((doc, docIndex) => (
                        <div
                          key={docIndex}
                          className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-xs"
                        >
                          <div className="flex items-start space-x-2">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded">
                              <FileText className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                                {doc.title}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                                {doc.excerpt}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                                  {doc.file_type.toUpperCase()}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                  {(doc.similarity_score * 100).toFixed(1)}% match
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                {message.created_at && (
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-red-200' : 'text-gray-400 dark:text-gray-500'
                  }`}>
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
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 mr-3 flex items-center justify-center shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">AI is thinking...</span>
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
      <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
        {/* Document Selection Info */}
        {selectedDocumentIds.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-1 bg-red-100 dark:bg-red-800/30 rounded-lg">
                  <Filter className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  Searching in {selectedDocumentIds.length} selected document{selectedDocumentIds.length === 1 ? '' : 's'}
                </span>
              </div>
              <button
                onClick={() => setSelectedDocumentIds([])}
                className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 px-2 py-1 rounded-md hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="flex items-end space-x-3">
          <button
            onClick={() => setIsDocumentSelectorOpen(true)}
            className="flex-shrink-0 p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            title="Select documents to search in"
          >
            <Filter className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
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
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Press Enter to send • Shift+Enter for new line
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>AI Ready</span>
          </div>
        </div>
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
