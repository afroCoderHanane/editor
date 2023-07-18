'use client'

import React, { useRef, useState, useEffect } from 'react';

function ImageEditor() {
  const imageCanvasRef = useRef(null);
  const cropCanvasRef = useRef(null);
  const cropRef = useRef({ startX: 0, startY: 0, endX: 0, endY: 0 });
  const [image, setImage] = useState(null);
  const [hasImage, setHasImage] = useState(false); // New state
  const [isCropping, setIsCropping] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropMode, setIsCropMode] = useState(false);
  const [cropEnabled, setCropEnabled] = useState(false); 
  const [previousImage, setPreviousImage] = useState(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        const canvas = imageCanvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, img.width, img.height);
      };
      img.src = image;
    }
  }, [image]);

  useEffect(() => {
    if (image) {
      setCropEnabled(true);  // Enable crop mode when image is present
    } else {
      setCropEnabled(false); // Disable crop mode when no image is present
    }
  }, [image]);



const updateImage = (imageData) => {
    setPreviousImage(image); // Save current image before updating
    setImage(imageData);
    setCropEnabled(true); // Enable crop mode when image is updated
  };

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      updateImage(reader.result); // Use updateImage function here
      setHasImage(true); // Image has been loaded
      const canvas = imageCanvasRef.current;
      const context = canvas.getContext('2d');
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        const cropCanvas = cropCanvasRef.current;
        cropCanvas.width = img.width;
        cropCanvas.height = img.height;
      };
    };
  
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setHasImage(false); // No image loaded
    }
  };
  


  const handleCropClick = () => {
    if (image) {  // Check if image is present
      setIsCropMode(true); // Enable crop mode when 'Crop' button is clicked
      setCropEnabled(true); // Enable crop mode when 'Crop' button is clicked
      cropRef.current = { startX: 0, startY: 0, endX: 0, endY: 0 }; // Reset cropping coordinates
    }
  };
  const handleMouseDown = (event) => {
    if (isCropMode) {
      setIsCropping(true);
      const rect = imageCanvasRef.current.getBoundingClientRect();
      const scaleX = imageCanvasRef.current.width / rect.width;
      const scaleY = imageCanvasRef.current.height / rect.height;
      cropRef.current.startX = (event.clientX - rect.left) * scaleX;
      cropRef.current.startY = (event.clientY - rect.top) * scaleY;
    }
  };

  const handleMouseMove = (event) => {
    if (isCropping) {
        const rect = imageCanvasRef.current.getBoundingClientRect();
        const scaleX = imageCanvasRef.current.width / rect.width;
        const scaleY = imageCanvasRef.current.height / rect.height;
        const cropCanvas = cropCanvasRef.current;
        const context = cropCanvas.getContext('2d');
        context.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
        context.beginPath();
        context.rect(cropRef.current.startX, cropRef.current.startY, (event.clientX - rect.left) * scaleX - cropRef.current.startX, (event.clientY - rect.top) * scaleY - cropRef.current.startY);
        context.lineWidth = 2;
        context.strokeStyle = 'red';
        context.stroke();
    }
  };

  const handleMouseUp = (event) => {
    if (isCropMode) {
    setIsCropping(false);
    const rect = imageCanvasRef.current.getBoundingClientRect();
    const scaleX = imageCanvasRef.current.width / rect.width;
    const scaleY = imageCanvasRef.current.height / rect.height;
    cropRef.current.endX = (event.clientX - rect.left) * scaleX;
    cropRef.current.endY = (event.clientY - rect.top) * scaleY;
    const canvas = imageCanvasRef.current;
    const context = canvas.getContext('2d');
    const x = Math.min(cropRef.current.startX, cropRef.current.endX);
    const y = Math.min(cropRef.current.startY, cropRef.current.endY);
    const width = Math.abs(cropRef.current.startX - cropRef.current.endX);
    const height = Math.abs(cropRef.current.startY - cropRef.current.endY);
    if(width > 0 && height > 0) {
      const imageData = context.getImageData(x, y, width, height);
      const canvas2 = document.createElement('canvas');
      canvas2.width = width;
      canvas2.height = height;
      const ctx = canvas2.getContext('2d');
      ctx.putImageData(imageData, 0, 0);
      setCroppedImage(canvas2.toDataURL());
    }
    }
  };

  const handleApplyClick = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = imageCanvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, img.width, img.height);
  
      // Set the imageCanvasRef dimensions and draw the cropped image onto it
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);
  
      const cropCanvas = cropCanvasRef.current;
      cropCanvas.width = img.width;
      cropCanvas.height = img.height;
      
      updateImage(croppedImage); // Update the image to be the cropped one
      setCroppedImage(null); // Reset the croppedImage
    };
  
    img.src = croppedImage;
    setIsCropping(false); // Set isCropping back to false
    setIsCropMode(false); // Exit crop mode after applying
    cropRef.current = { startX: 0, startY: 0, endX: 0, endY: 0 }; // Reset crop reference
  };


  const handleUndoClick = () => {
    const img = new Image();
    img.onload = () => {
      // Set the imageCanvasRef dimensions and draw the previous image onto it
      const canvas = imageCanvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, img.width, img.height);
      
      // Set the cropCanvasRef dimensions
      const cropCanvas = cropCanvasRef.current;
      cropCanvas.width = img.width;
      cropCanvas.height = img.height;
  
      // Use updateImage function here
      updateImage(previousImage);
      setCroppedImage(null); // Reset the croppedImage
    };
    
    img.src = previousImage;
    setIsCropMode(false); // Exit crop mode
    cropRef.current = { startX: 0, startY: 0, endX: 0, endY: 0 }; // Reset crop reference
  };
  
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'croppedImage.png';
    link.href = croppedImage;
    link.click();
  };

const handleImageLoad = (event) => {
    setImageWidth(event.target.naturalWidth);
    setImageHeight(event.target.naturalHeight);
  };


  return (
    <div className="flex flex-col items-center justify-center space-y-5 h-screen bg-gray-100">
      <div className="flex justify-around w-full p-4">
        <button className={`px-4 py-2 ${!image ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white cursor-pointer'} rounded`} disabled={!image} onClick={handleCropClick}>Crop</button>
        {isCropMode && 
          <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleApplyClick}>Apply</button>
        }
        {croppedImage && 
          <button className="px-4 py-2 bg-yellow-500 text-white rounded" onClick={handleDownload}>Download</button>
        }
        {image && previousImage &&
          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleUndoClick}>Undo</button>
        }
      </div>
      <div className="flex justify-around w-full h-4/5 p-4">
        <div className="w-1/2 relative overflow-hidden flex items-center justify-center bg-white border-4 border-indigo-500 rounded">
          <input className="px-4 py-2 border border-gray-300 rounded absolute top-2 left-2 z-10" type="file" onChange={handleImageUpload} />
          <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            {image && 
              <div className="w-full h-full flex items-center justify-center">
                <img onLoad={handleImageLoad} src={image} alt="To be edited" className="object-contain max-h-full max-w-full" style={{backgroundColor: 'transparent'}} />
              </div>
            }
            <canvas ref={imageCanvasRef} className="absolute top-0 left-0 w-full h-full"/>
          </div>
          <canvas 
            ref={cropCanvasRef} 
            className={isCropMode ? "absolute cursor-crosshair w-full h-full" : "absolute cursor-pointer w-full h-full"} 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
          {croppedImage &&
            <div className="absolute top-2 right-2 w-32 h-32 overflow-hidden bg-white border-4 border-indigo-500 rounded flex items-center justify-center">
              <img className="object-contain max-h-full max-w-full" src={croppedImage} alt="Cropped" />
            </div>
          }
        </div>
      </div>
    </div>
  );
  
 
}

export default ImageEditor;