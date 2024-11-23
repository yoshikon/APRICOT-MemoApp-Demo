import React, { useState } from 'react';
import { Save, Clock } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { ImageModal } from './ImageModal';

interface MemoEditorProps {
  title: string;
  content: string;
  images: string[];
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onImageUpload: (imageUrl: string) => void;
  onSave: () => void;
}

export function MemoEditor({
  title,
  content,
  images = [],
  onTitleChange,
  onContentChange,
  onImageUpload,
  onSave,
}: MemoEditorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <div className="p-6 glass-effect border-b border-gray-200">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="タイトルを入力"
          className="text-2xl font-bold bg-transparent border-none focus:outline-none w-full placeholder-gray-400"
        />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>最終更新: {new Date().toLocaleString('ja-JP')}</span>
          </div>
          <ImageUpload onImageUpload={onImageUpload} />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col p-6 relative">
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="メモを入力してください..."
          className="w-full flex-1 resize-none focus:outline-none text-gray-700 leading-relaxed custom-scrollbar mb-4"
        />
        
        {images && images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`添付画像 ${index + 1}`}
                  onClick={() => setSelectedImage(image)}
                  className="rounded-lg shadow-md max-h-48 object-cover w-full cursor-pointer transition-transform hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg" />
              </div>
            ))}
          </div>
        )}
        
        <button
          onClick={onSave}
          className="absolute bottom-6 right-6 flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Save size={16} />
          保存
        </button>
      </div>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}