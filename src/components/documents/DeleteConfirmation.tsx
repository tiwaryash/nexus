import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export default function DeleteConfirmation({ onConfirm, onCancel, isDeleting }: DeleteConfirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full"
    >
      <div className="flex items-center justify-center mb-4">
        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
          <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-center mb-2">Delete Document</h3>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
        Are you sure you want to delete this document? This action cannot be undone.
      </p>
      
      <div className="flex gap-3 justify-center">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </motion.div>
  );
} 