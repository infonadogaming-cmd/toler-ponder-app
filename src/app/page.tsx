"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [resultImg, setResultImg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setError(null);
    setResultImg(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("/api/process_image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error processing image: ${response.statusText}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setResultImg(objectUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResultImg(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white selection:bg-purple-500/30 font-sans">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <header className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-sm">
            Meme Generator
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Upload any image and we'll magically warp and composite it into our custom 3D perspective template.
          </p>
        </header>

        <section className="flex flex-col items-center justify-center min-h-[400px] w-full relative">
          {/* Background decorative blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />

          {!file && !isProcessing && !resultImg && (
            <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
              <Dropzone onFileSelect={handleFileSelect} />
            </div>
          )}

          {isProcessing && (
            <div className="flex flex-col items-center space-y-6 animate-in fade-in duration-500">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-2xl font-medium text-purple-300 animate-pulse">
                Processing your image...
              </h3>
              <p className="text-gray-400">Applying perspective transform & magic</p>
            </div>
          )}

          {error && !isProcessing && (
            <div className="flex flex-col items-center space-y-6 bg-red-500/10 border border-red-500/50 p-8 rounded-2xl max-w-lg text-center animate-in zoom-in-95 duration-300">
              <div className="text-red-400 bg-red-500/20 p-3 rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-300">{error}</p>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium border border-gray-600"
              >
                Try Again
              </button>
            </div>
          )}

          {resultImg && !isProcessing && (
            <div className="w-full max-w-4xl flex flex-col items-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="relative group rounded-xl overflow-hidden shadow-2xl shadow-purple-500/20 ring-1 ring-white/10 w-full bg-gray-900/50 backdrop-blur-sm p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultImg}
                  alt="Processed Meme"
                  className="w-full h-auto rounded-lg object-contain"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a
                  href={resultImg}
                  download="generated-meme.jpg"
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full font-bold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-105 active:scale-95"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Meme</span>
                </a>
                <button
                  onClick={handleReset}
                  className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-bold text-lg transition-all border border-gray-700 hover:border-gray-500"
                >
                  Create Another
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
