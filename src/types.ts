export interface Memo {
  id: string;
  title: string;
  content: string;
  images: string[];
  updatedAt: string;
  folderId: string | null;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}