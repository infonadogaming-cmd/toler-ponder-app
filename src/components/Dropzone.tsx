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
      className={`w-full max-w-2xl mx-auto p-12 rounded-3xl border-8 border-black transition-all duration-200 ease-out cursor-pointer flex flex-col items-center justify-center min-h-[350px] text-center
        ${isDragActive 
          ? 'bg-yellow-300 scale-105 shadow-[12px_12px_0_0_rgba(0,0,0,1)] rotate-1' 
          : 'bg-white hover:bg-yellow-100 hover:-translate-y-2 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] shadow-[6px_6px_0_0_rgba(0,0,0,1)]'}`}
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
      <div className="flex flex-col items-center space-y-6 pointer-events-none">
        <div className={`p-6 rounded-full border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${isDragActive ? 'bg-white' : 'bg-sky-300'} transition-colors duration-300`}>
          <svg
            className="w-14 h-14 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <div>
          <p className="text-4xl font-[family-name:var(--font-bangers)] text-black mb-3 tracking-wide drop-shadow-[2px_2px_0_rgba(255,255,255,1)]">
            {isDragActive ? 'Drop it here!!' : 'Toss your image right here!'}
          </p>
          <p className="text-xl text-slate-700 font-bold bg-white/50 inline-block px-4 py-1 rounded-lg">
            (or just click to browse)
          </p>
        </div>
      </div>
    </div>
  );
}
