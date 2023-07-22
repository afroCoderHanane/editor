'use client'
import React, { useRef, useState } from 'react';

const UploadForm = () => {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [folder, setFolder] = useState('');
  const [uploading, setUploading] = useState(false);
  const folders = ["Folder1", "Folder2", "Folder3", "Folder4"];

  const handleSubmit = async (event) => {
    event.preventDefault();
    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('caption', caption);
    formData.append('folder', folder);
    setUploading(true);
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (response.ok) {
        alert('Success: File uploaded');
      } else {
        alert('Error: Could not upload file');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="w-64">
        <input type="file" ref={fileInputRef} required />
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption" required />
        <select value={folder} onChange={(e) => setFolder(e.target.value)} required>
          <option value="">--Please choose a folder--</option>
          {folders.map((folder, index) => (
            <option key={index} value={folder}>
              {folder}
            </option>
          ))}
        </select>
        <button type="submit" disabled={uploading}>Submit</button>
      </form>
    </div>
  );
};

export default UploadForm;
