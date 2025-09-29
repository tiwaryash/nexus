'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, Clock } from 'lucide-react';
import Button from '../ui/Button';

interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

interface ConversationSidebarProps {
  selectedConversationId?: number;
  onSelectConversation: (conversationId: number) => void;
  onNewConversation: () => void;
  className?: string;
}

export default function ConversationSidebar({
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
  className = ""
}: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const conversationsData = await response.json();
        setConversations(conversationsData);
      } else {
        throw new Error('Failed to load conversations');
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: 'New Conversation',
        }),
      });

      if (response.ok) {
        const newConversation = await response.json();
        setConversations(prev => [newConversation, ...prev]);
        onSelectConversation(newConversation.id);
      } else {
        throw new Error('Failed to create conversation');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError('Failed to create new conversation');
    }
  };

  const deleteConversation = async (conversationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this conversation?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        
        // If the deleted conversation was selected, clear selection
        if (selectedConversationId === conversationId) {
          onNewConversation();
        }
      } else {
        throw new Error('Failed to delete conversation');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      setError('Failed to delete conversation');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const truncateTitle = (title: string, maxLength: number = 30) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <div className={`flex flex-col h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Button
          onClick={createNewConversation}
          className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Loading conversations...
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-red-500 dark:text-red-400">
            {error}
          </div>
        )}

        {!isLoading && !error && conversations.length === 0 && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <MessageSquare className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a new chat to begin</p>
          </div>
        )}

        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`group cursor-pointer p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              selectedConversationId === conversation.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {truncateTitle(conversation.title)}
                  </h3>
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(conversation.updated_at)}
                  </span>
                  {conversation.message_count > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      • {conversation.message_count} messages
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => deleteConversation(conversation.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                title="Delete conversation"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
