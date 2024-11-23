import React, { useState } from 'react';
import { MemoList } from './components/MemoList';
import { MemoEditor } from './components/MemoEditor';
import { EmptyState } from './components/EmptyState';
import { useMemos } from './hooks/useMemos';
import { type Memo } from './types';

function App() {
  const {
    memos,
    folders,
    createMemo,
    createFolder,
    updateMemo,
    deleteMemo,
    deleteFolder,
    moveMemoToFolder,
    setSearchQuery
  } = useMemos();
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleCreateMemo = (folderId: string | null = null) => {
    const newMemo = createMemo(folderId);
    setSelectedMemo(newMemo);
    setTitle(newMemo.title);
    setContent(newMemo.content);
    setImages([]);
  };

  const handleSaveMemo = () => {
    if (!selectedMemo) return;
    
    const updatedMemo = updateMemo({
      ...selectedMemo,
      title,
      content,
      images,
    });
    
    setSelectedMemo(updatedMemo);
  };

  const handleDeleteMemo = (id: string) => {
    deleteMemo(id);
    if (selectedMemo?.id === id) {
      setSelectedMemo(null);
      setTitle('');
      setContent('');
      setImages([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen flex">
        <MemoList
          memos={memos}
          folders={folders}
          selectedMemo={selectedMemo}
          onSelect={(memo) => {
            setSelectedMemo(memo);
            setTitle(memo.title);
            setContent(memo.content);
            setImages(memo.images || []);
          }}
          onDelete={handleDeleteMemo}
          onCreateMemo={handleCreateMemo}
          onCreateFolder={createFolder}
          onDeleteFolder={deleteFolder}
          onMoveMemo={moveMemoToFolder}
          onSearch={setSearchQuery}
        />
        <div className="flex-1 bg-white">
          {selectedMemo ? (
            <MemoEditor
              title={title}
              content={content}
              images={images}
              onTitleChange={setTitle}
              onContentChange={setContent}
              onImageUpload={(imageUrl) => setImages([...images, imageUrl])}
              onSave={handleSaveMemo}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;