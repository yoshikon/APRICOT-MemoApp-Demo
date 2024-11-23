import React, { useState, useRef } from 'react';
import { Trash2, PlusCircle, Search, FolderPlus, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { type Memo, type Folder as FolderType } from '../types';
import { FolderModal } from './FolderModal';
import { MemoContextMenu } from './MemoContextMenu';

interface MemoListProps {
  memos: Memo[];
  folders: FolderType[];
  selectedMemo: Memo | null;
  onSelect: (memo: Memo) => void;
  onDelete: (id: string) => void;
  onCreateMemo: (folderId: string | null) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (id: string) => void;
  onMoveMemo: (memoId: string, folderId: string | null) => void;
  onSearch: (query: string) => void;
}

export function MemoList({
  memos,
  folders,
  selectedMemo,
  onSelect,
  onDelete,
  onCreateMemo,
  onCreateFolder,
  onDeleteFolder,
  onMoveMemo,
  onSearch,
}: MemoListProps) {
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{
    memoId: string;
    x: number;
    y: number;
  } | null>(null);
  const [draggedMemoId, setDraggedMemoId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const dragTimeoutRef = useRef<number>();

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleContextMenu = (e: React.MouseEvent, memoId: string) => {
    e.preventDefault();
    setContextMenu({
      memoId,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleDragStart = (e: React.DragEvent, memoId: string) => {
    setDraggedMemoId(memoId);
    e.dataTransfer.setData('text/plain', memoId);
    e.dataTransfer.effectAllowed = 'move';

    // ドラッグ中のプレビュー画像を設定
    const memo = memos.find(m => m.id === memoId);
    if (memo) {
      const dragPreview = document.createElement('div');
      dragPreview.className = 'bg-white p-2 rounded shadow-lg text-sm';
      dragPreview.textContent = memo.title;
      document.body.appendChild(dragPreview);
      e.dataTransfer.setDragImage(dragPreview, 0, 0);
      setTimeout(() => document.body.removeChild(dragPreview), 0);
    }
  };

  const handleDragOver = (e: React.DragEvent, folderId: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dragTimeoutRef.current) {
      window.clearTimeout(dragTimeoutRef.current);
    }

    if (folderId && !expandedFolders.has(folderId)) {
      dragTimeoutRef.current = window.setTimeout(() => {
        setExpandedFolders(prev => new Set([...prev, folderId]));
      }, 800);
    }

    setDropTargetId(folderId);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = () => {
    if (dragTimeoutRef.current) {
      window.clearTimeout(dragTimeoutRef.current);
    }
    setDropTargetId(null);
  };

  const handleDrop = (e: React.DragEvent, folderId: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dragTimeoutRef.current) {
      window.clearTimeout(dragTimeoutRef.current);
    }

    const memoId = e.dataTransfer.getData('text/plain');
    if (memoId && draggedMemoId) {
      onMoveMemo(memoId, folderId);
    }

    setDraggedMemoId(null);
    setDropTargetId(null);
  };

  const renderMemoItem = (memo: Memo) => (
    <div
      key={memo.id}
      draggable
      onDragStart={(e) => handleDragStart(e, memo.id)}
      className={`memo-card group p-3 rounded-lg cursor-pointer hover:bg-white hover:shadow-md transition-all duration-200 ${
        selectedMemo?.id === memo.id ? 'active bg-white shadow-md' : ''
      } ${draggedMemoId === memo.id ? 'opacity-50' : ''}`}
      onClick={() => onSelect(memo)}
      onContextMenu={(e) => handleContextMenu(e, memo.id)}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-medium text-gray-900 truncate flex-1 leading-tight">
          {memo.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(memo.id);
          }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200 p-1 hover:bg-red-50 rounded-full"
          title="削除"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-gray-300" />
        {memo.updatedAt}
      </p>
    </div>
  );

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 glass-effect border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 text-lg">メモ一覧</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFolderModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors shadow-sm hover:shadow"
              title="フォルダを作成"
            >
              <FolderPlus size={16} />
            </button>
            <button
              onClick={() => onCreateMemo(null)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm hover:shadow"
              title="新規メモ"
            >
              <PlusCircle size={16} />
              <span className="text-sm font-medium">新規作成</span>
            </button>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="メモを検索..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        <div className="space-y-1">
          <div
            className={`space-y-1 p-2 rounded-lg ${
              dropTargetId === null ? 'bg-blue-50/50 ring-2 ring-blue-200/50' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, null)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, null)}
          >
            <p className="text-xs font-medium text-gray-500 px-2 mb-2">未分類</p>
            {memos.filter(memo => !memo.folderId).map(renderMemoItem)}
          </div>
          
          {folders.map(folder => (
            <div key={folder.id} className="space-y-1">
              <div
                className={`flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer group ${
                  dropTargetId === folder.id ? 'bg-blue-50 ring-2 ring-blue-200' : ''
                }`}
                onClick={() => toggleFolder(folder.id)}
                onDragOver={(e) => handleDragOver(e, folder.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, folder.id)}
              >
                <div className="flex items-center gap-2">
                  {expandedFolders.has(folder.id) ? (
                    <ChevronDown size={16} className="text-gray-500" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-500" />
                  )}
                  <Folder size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{folder.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateMemo(folder.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all"
                  >
                    <PlusCircle size={14} className="text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFolder(folder.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all"
                  >
                    <Trash2 size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>
              {expandedFolders.has(folder.id) && (
                <div className="ml-4 pl-4 border-l border-gray-200">
                  {memos.filter(memo => memo.folderId === folder.id).map(renderMemoItem)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showFolderModal && (
        <FolderModal
          onClose={() => setShowFolderModal(false)}
          onCreateFolder={onCreateFolder}
        />
      )}

      {contextMenu && (
        <MemoContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          folders={folders}
          onClose={() => setContextMenu(null)}
          onMove={(folderId) => {
            onMoveMemo(contextMenu.memoId, folderId);
            setContextMenu(null);
          }}
        />
      )}
    </div>
  );
}