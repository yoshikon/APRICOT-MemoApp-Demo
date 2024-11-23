import React, { useEffect, useRef } from 'react';
import { Folder } from 'lucide-react';
import { type Folder as FolderType } from '../types';

interface MemoContextMenuProps {
  x: number;
  y: number;
  folders: FolderType[];
  onClose: () => void;
  onMove: (folderId: string | null) => void;
}

export function MemoContextMenu({ x, y, folders, onClose, onMove }: MemoContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // 画面外にはみ出さないように位置を調整
  const adjustedY = Math.min(y, window.innerHeight - (folders.length + 1) * 40);
  const adjustedX = Math.min(x, window.innerWidth - 200);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-scaleIn"
      style={{ top: adjustedY, left: adjustedX }}
    >
      <div className="px-3 py-2 text-xs font-medium text-gray-500">移動先を選択</div>
      <div className="h-px bg-gray-200 my-1" />
      <button
        onClick={() => onMove(null)}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
      >
        <Folder size={16} className="text-gray-400" />
        未分類
      </button>
      {folders.map(folder => (
        <button
          key={folder.id}
          onClick={() => onMove(folder.id)}
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
        >
          <Folder size={16} className="text-gray-400" />
          {folder.name}
        </button>
      ))}
    </div>
  );
}