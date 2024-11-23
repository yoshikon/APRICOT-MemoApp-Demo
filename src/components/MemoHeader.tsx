import React from 'react';
import { PlusCircle } from 'lucide-react';

interface MemoHeaderProps {
  onCreateMemo: () => void;
}

export function MemoHeader({ onCreateMemo }: MemoHeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">メモアプリ</h1>
          <button
            onClick={onCreateMemo}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <PlusCircle size={16} />
            新規メモ
          </button>
        </div>
      </div>
    </header>
  );
}