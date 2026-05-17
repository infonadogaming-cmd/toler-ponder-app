"use client";

import React, { useCallback, useState } from 'react';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
}

export default function Dropzone({ onFileSelect }: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  return (
    <div
      className={`w-full max-w-md mx-auto p-8 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center justify-center min-h-[300px] text-center
        ${isDragActive ? 'border-purple-500 bg-purple-500/10 scale-105 shadow-[0_0_30px_rgba(168,85,247,0.3)]' : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <div className="flex flex-col items-center space-y-4">
        <div className={`p-4 rounded-full ${isDragActive ? 'bg-purple-500/20' : 'bg-gray-700'} transition-colors duration-300`}>
          <svg
            className={`w-10 h-10 ${isDragActive ? 'text-purple-400' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <div>
          <p className="text-xl font-semibold text-white mb-1">
            {isDragActive ? 'Drop image here' : 'Upload your image'}
          </p>
          <p className="text-sm text-gray-400">
            Drag and drop or click to browse
          </p>
        </div>
      </div>
    </div>
  );
}
