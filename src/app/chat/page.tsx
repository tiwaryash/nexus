'use client';

import React, { useState } from 'react';
import { RequireAuth } from '@/components/auth/RequireAuth';
import MainLayout from '@/components/layout/MainLayout';
import ChatInterface from '@/components/rag/ChatInterface';
import ConversationSidebar from '@/components/rag/ConversationSidebar';

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | undefined>();

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
  };

  const handleNewConversation = (conversationId?: number) => {
    if (conversationId) {
      setSelectedConversationId(conversationId);
    } else {
      setSelectedConversationId(undefined);
    }
  };

  return (
    <RequireAuth>
      <MainLayout>
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <ConversationSidebar
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
              onNewConversation={() => handleNewConversation()}
            />
          </div>

          {/* Main Chat Area */}
          <div className="flex-1">
            <ChatInterface
              conversationId={selectedConversationId}
              onNewConversation={handleNewConversation}
            />
          </div>
        </div>
      </MainLayout>
    </RequireAuth>
  );
}
