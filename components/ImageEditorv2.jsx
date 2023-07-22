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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <div className="mb-4">
          <h2 className="text-center font-bold text-xl text-black">Upload File</h2>
        </div>
        <form onSubmit={handleSubmit} className="w-96">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
              Choose File
            </label>
            <input type="file" id="file" ref={fileInputRef} required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="caption">
              Caption
            </label>
            <textarea id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="folder">
              Select Folder
            </label>
            <select id="folder" value={folder} onChange={(e) => setFolder(e.target.value)} className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
              <option value="">--Please choose a folder--</option>
              {folders.map((folder, index) => (
                <option key={index} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" disabled={uploading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
