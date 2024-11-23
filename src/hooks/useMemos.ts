import { useState, useEffect } from 'react';
import { type Memo, type Folder } from '../types';

export function useMemos() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedMemos = localStorage.getItem('memos');
    const savedFolders = localStorage.getItem('folders');
    
    if (savedMemos) {
      const parsedMemos = JSON.parse(savedMemos);
      const validatedMemos = parsedMemos.map((memo: Memo) => ({
        ...memo,
        images: memo.images || [],
        folderId: memo.folderId || null,
      }));
      setMemos(validatedMemos);
    }

    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
  }, []);

  const saveMemos = (newMemos: Memo[]) => {
    localStorage.setItem('memos', JSON.stringify(newMemos));
    setMemos(newMemos);
  };

  const saveFolders = (newFolders: Folder[]) => {
    localStorage.setItem('folders', JSON.stringify(newFolders));
    setFolders(newFolders);
  };

  const createFolder = (name: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toLocaleString('ja-JP'),
    };
    saveFolders([...folders, newFolder]);
    return newFolder;
  };

  const createMemo = (folderId: string | null = null) => {
    const newMemo: Memo = {
      id: Date.now().toString(),
      title: '新しいメモ',
      content: '',
      images: [],
      folderId,
      updatedAt: new Date().toLocaleString('ja-JP'),
    };
    saveMemos([newMemo, ...memos]);
    return newMemo;
  };

  const updateMemo = (memo: Memo) => {
    const updatedMemo = {
      ...memo,
      images: memo.images || [],
      updatedAt: new Date().toLocaleString('ja-JP'),
    };
    const remainingMemos = memos.filter((m) => m.id !== memo.id);
    saveMemos([updatedMemo, ...remainingMemos]);
    return updatedMemo;
  };

  const moveMemoToFolder = (memoId: string, folderId: string | null) => {
    const updatedMemos = memos.map(memo => 
      memo.id === memoId ? { ...memo, folderId } : memo
    );
    saveMemos(updatedMemos);
  };

  const deleteMemo = (id: string) => {
    saveMemos(memos.filter((memo) => memo.id !== id));
  };

  const deleteFolder = (id: string) => {
    // フォルダを削除すると、そのフォルダ内のメモは未分類に移動
    const updatedMemos = memos.map(memo => 
      memo.folderId === id ? { ...memo, folderId: null } : memo
    );
    saveMemos(updatedMemos);
    saveFolders(folders.filter(folder => folder.id !== id));
  };

  const filteredMemos = memos.filter((memo) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      memo.title.toLowerCase().includes(searchLower) ||
      memo.content.toLowerCase().includes(searchLower)
    );
  });

  return {
    memos: filteredMemos,
    folders,
    createMemo,
    createFolder,
    updateMemo,
    deleteMemo,
    deleteFolder,
    moveMemoToFolder,
    setSearchQuery,
  };
}