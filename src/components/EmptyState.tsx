import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
      <div className="bg-blue-50 rounded-full p-6 mb-6">
        <FileText size={48} className="text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        メモが選択されていません
      </h3>
      <p className="text-gray-500 text-center max-w-md mb-6">
        左側のメニューからメモを選択するか、新規メモを作成してください
      </p>
      <div className="flex items-center gap-2 text-sm text-blue-500">
        <ArrowRight size={16} />
        <span>新規作成ボタンをクリック</span>
      </div>
    </div>
  );
}