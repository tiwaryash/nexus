import { useEffect, useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import * as Y from 'yjs';

export default function CollaborativeEditor({ documentId }) {
  const ydoc = new Y.Doc();
  const { socket, isConnected } = useWebSocket(`ws://localhost:8000/ws/${documentId}`);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: ydoc,
      }),
    ],
  });

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm text-gray-500">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
} 