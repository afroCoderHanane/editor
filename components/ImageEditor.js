'use client'

import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

function ImageEditor({ imageUrl }) {
  const cropperRef = useRef(null);
  const [cropMode, setCropMode] = useState(false);
  const [image, setImage] = useState(imageUrl);
  const [imageHistory, setImageHistory] = useState([imageUrl]);
  const [cropAspectRatio, setCropAspectRatio] = useState(1);

  const cropPresets = [
    { label: '4:3', aspectRatio: 4 / 3 },
    { label: '16:9', aspectRatio: 16 / 9 },
  ];

  const handleCropPresetClick = (presetAspectRatio) => {
    if (cropperRef.current) {
      const imageElement = cropperRef.current;
      const cropper = imageElement.cropper;
      cropper.setAspectRatio(presetAspectRatio);
    }
    setCropAspectRatio(presetAspectRatio);
  };

  const handleCropClick = () => {
    if (cropperRef.current) {
      const imageElement = cropperRef.current;
      const cropper = imageElement.cropper;
      if (!cropMode) {
        cropper.setDragMode('crop');
        cropper.setCropBoxData({ left: 0, top: 0, width: 200, height: 200 / cropAspectRatio });
      } else {
        cropper.setDragMode('move');
      }
    }
    setCropMode(!cropMode);
  };

  const handleApplyClick = () => {
    if (cropperRef.current) {
      const imageElement = cropperRef.current;
      const cropper = imageElement.cropper;
      const croppedImageDataUrl = cropper.getCroppedCanvas().toDataURL();
      setImage(croppedImageDataUrl);
      setImageHistory(prevHistory => [...prevHistory, croppedImageDataUrl]);
      cropper.setDragMode('move');
      cropper.clear();
    }
    setCropMode(false);
  };

  const handleUndoClick = () => {
    if (imageHistory.length > 1) {
      setImageHistory(prevHistory => {
        const newHistory = [...prevHistory];
        newHistory.pop();
        setImage(newHistory[newHistory.length - 1]);
        return newHistory;
      });
    }
  };

  const handleSave = () => {
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = image;
    link.click();
  };

  const handleFilterClick = () => {
    console.log('Filter');
    // If you implement any filter action, don't forget to update the history as well
    // setImageHistory(prevHistory => [...prevHistory, newImage]);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-5 min-h-screen bg-gray-100">
      <div className="w-1/2 flex flex-col items-center justify-center p-4">
        <div className="w-full flex flex-row justify-around items-center border border-black rounded p-2">
          <button
            className={`px-4 py-2 ${!image ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white cursor-pointer'} rounded`}
            disabled={!image}
            onClick={handleCropClick}
          >
            Crop
          </button>
          <button
            className={`px-4 py-2 ${!image ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-500 text-white cursor-pointer'} rounded`}
            disabled={!image}
            onClick={handleFilterClick}
          >
            Filter
          </button>
          <button
            className={`px-4 py-2 ${!image || imageHistory.length < 2 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 text-white cursor-pointer'} rounded`}
            disabled={!image || imageHistory.length < 2}
            onClick={handleUndoClick}
          >
            Undo
          </button>
          <button
            className={`px-4 py-2 ${!image ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500 text-white cursor-pointer'} rounded`}
            disabled={!image}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
        {cropMode && (
          <div className="w-full flex justify-around items-center border border-black rounded p-2 mt-2">
            {cropPresets.map((preset, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded ${cropAspectRatio === preset.aspectRatio ? 'bg-green-500' : 'bg-gray-500'} text-white cursor-pointer`}
                onClick={() => handleCropPresetClick(preset.aspectRatio)}
              >
                {preset.label}
              </button>
            ))}
            <button
              className={`px-4 py-2 ${!image ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 text-white cursor-pointer'} rounded`}
              disabled={!image}
              onClick={handleApplyClick}
            >
              Apply
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-around w-4/5 flex-grow p-4">
        <div className="w-1/2 relative overflow-hidden flex items-center justify-center bg-white border-4 border-black rounded">
          {image && (
            <Cropper
              src={image}
              ref={cropperRef}
              style={{ height: 400, width: '100%' }}
              aspectRatio={cropAspectRatio || 1}
              guides={false}
              dragMode="move"
              autoCrop={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageEditor;