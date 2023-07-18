'use client'
import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import Slider from 'react-input-slider';
import 'cropperjs/dist/cropper.css';

function ImageEditor({ imageUrl }) {
  const cropperRef = useRef(null);
  const [cropMode, setCropMode] = useState(false);
  const [filterMode, setFilterMode] = useState(false);
  const [image, setImage] = useState(imageUrl);
  const [imageHistory, setImageHistory] = useState([imageUrl]);
  const [cropAspectRatio, setCropAspectRatio] = useState(1);

  const [filterSettings, setFilterSettings] = useState({
    contrast: 1,
    saturation: 1,
    vibrance: 0,
    exposure: 1,
  });

  const handleCropClick = () => {
    setFilterMode(false);
    if (cropperRef.current) {
      const imageElement = cropperRef.current;
      const cropper = imageElement.cropper;
      if (!cropMode) {
        cropper.setDragMode('crop');
        cropper.setCropBoxData({ left: 0, top: 0, width: 200, height: 200 });
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
      const croppedImageUrl = cropper.getCroppedCanvas().toDataURL();
      setImage(croppedImageUrl);
      cropper.setDragMode('move');
      cropper.clear();
      setImageHistory([...imageHistory, croppedImageUrl]);
    }
    setCropMode(false);
    setFilterMode(false);
  };

  const handleSave = () => {
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = image;
    link.click();
  };

  const handleUndo = () => {
    if (imageHistory.length > 1) {
      const newHistory = [...imageHistory];
      newHistory.pop();
      setImage(newHistory[newHistory.length - 1]);
      setImageHistory(newHistory);
    }
  };

  const handleFilterClick = () => {
    setCropMode(false);
    setFilterMode(true);
  };

  // TODO: replace these placeholder functions with actual filter logic
  const handleContrastChange = (value) => {
    setFilterSettings({ ...filterSettings, contrast: value });
  };

  const handleSaturationChange = (value) => {
    setFilterSettings({ ...filterSettings, saturation: value });
  };

  const handleVibranceChange = (value) => {
    setFilterSettings({ ...filterSettings, vibrance: value });
  };

  const handleExposureChange = (value) => {
    setFilterSettings({ ...filterSettings, exposure: value });
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
            className={`px-4 py-2 ${!image ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500 text-white cursor-pointer'} rounded`}
            disabled={!image}
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className={`px-4 py-2 ${imageHistory.length > 1 ? 'bg-red-500 text-white cursor-pointer' : 'bg-gray-300 cursor-not-allowed'} rounded`}
            disabled={imageHistory.length <= 1}
            onClick={handleUndo}
          >
            Undo
          </button>
        </div>
        {cropMode && (
          <div className="w-full flex flex-row justify-around items-center border border-black rounded p-2 mt-2">
            <button
              className="px-4 py-2 bg-green-500 text-white cursor-pointer rounded"
              onClick={() => setCropAspectRatio(4 / 3)}
            >
              4:3
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white cursor-pointer rounded"
              onClick={() => setCropAspectRatio(16 / 9)}
            >
              16:9
            </button>
            <button
              className={`px-4 py-2 ${!image ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 text-white cursor-pointer'} rounded`}
              disabled={!image}
              onClick={handleApplyClick}
            >
              Apply
            </button>
          </div>
        )}
        {filterMode && (
          <div className="w-full flex flex-col items-center border border-black rounded p-2 mt-2">
            <label>Contrast: {filterSettings.contrast}</label>
            <Slider
              axis="x"
              xstep={0.1}
              xmin={0}
              xmax={2}
              x={filterSettings.contrast}
              onChange={({ x }) => handleContrastChange(x)}
            />
            <label>Saturation: {filterSettings.saturation}</label>
            <Slider
              axis="x"
              xstep={0.1}
              xmin={0}
              xmax={2}
              x={filterSettings.saturation}
              onChange={({ x }) => handleSaturationChange(x)}
            />
            <label>Vibrance: {filterSettings.vibrance}</label>
            <Slider
              axis="x"
              xstep={0.1}
              xmin={0}
              xmax={2}
              x={filterSettings.vibrance}
              onChange={({ x }) => handleVibranceChange(x)}
            />
            <label>Exposure: {filterSettings.exposure}</label>
            <Slider
              axis="x"
              xstep={0.1}
              xmin={0}
              xmax={2}
              x={filterSettings.exposure}
              onChange={({ x }) => handleExposureChange(x)}
            />
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
        <Cropper
          ref={cropperRef}
          src={image}
          style={{ height: '100%', width: '100%' }}
          initialAspectRatio={cropAspectRatio}
          aspectRatio={cropAspectRatio}
          preview=".img-preview"
          guides={false}
        />
      </div>
    </div>
  );
}

export default ImageEditor;
