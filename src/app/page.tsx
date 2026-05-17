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
    <main className="min-h-screen bg-sky-200 text-slate-900 selection:bg-yellow-400 font-sans pb-20 relative overflow-hidden">
      {/* Cartoon clouds decoration */}
      <div className="absolute top-10 left-10 w-32 h-16 bg-white rounded-full opacity-80 shadow-md">
        <div className="absolute -top-6 left-6 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute -top-4 right-4 w-12 h-12 bg-white rounded-full"></div>
      </div>
      <div className="absolute top-24 right-20 w-40 h-20 bg-white rounded-full opacity-80 shadow-md">
        <div className="absolute -top-8 left-8 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute -top-4 right-6 w-14 h-14 bg-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl relative z-10">
        <header className="text-center mb-12 space-y-4">
          <div className="inline-block relative">
            <h1 className="text-6xl md:text-8xl tracking-wider text-yellow-400 font-[family-name:var(--font-bangers)] drop-shadow-[4px_4px_0_rgba(0,0,0,1)] [-webkit-text-stroke:2px_black] rotate-[-2deg] transform hover:rotate-2 hover:scale-105 transition-all cursor-default">
              What is Toler Looking at??
            </h1>
            {/* Sparkle decorative element */}
            <div className="absolute -top-4 -right-8 text-4xl text-pink-500 animate-bounce">✨</div>
          </div>
          <p className="text-xl md:text-2xl text-slate-800 font-bold max-w-2xl mx-auto bg-white inline-block px-6 py-2 rounded-full border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            Upload a pic and find out! 👀
          </p>
        </header>

        <section className="flex flex-col items-center justify-center min-h-[400px] w-full">
          {!file && !isProcessing && !resultImg && (
            <div className="w-full animate-in zoom-in duration-500 ease-out">
              <Dropzone onFileSelect={handleFileSelect} />
            </div>
          )}

          {isProcessing && (
            <div className="flex flex-col items-center space-y-6 animate-in fade-in duration-500 bg-white p-10 rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-8 border-slate-200 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-yellow-400 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-3xl font-[family-name:var(--font-bangers)] tracking-wide text-black animate-pulse">
                Cooking up something silly...
              </h3>
            </div>
          )}

          {error && !isProcessing && (
            <div className="flex flex-col items-center space-y-4 bg-red-400 border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] max-w-lg text-center animate-in wobble duration-500">
              <div className="text-white text-5xl mb-2">💥</div>
              <h3 className="text-3xl font-[family-name:var(--font-bangers)] text-white tracking-wide">Uh Oh!</h3>
              <p className="text-xl text-black font-bold bg-white/50 px-4 py-2 rounded-xl">{error}</p>
              <button
                onClick={handleReset}
                className="mt-4 px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl font-bold text-xl border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
              >
                Try Again!
              </button>
            </div>
          )}

          {resultImg && !isProcessing && (
            <div className="w-full max-w-4xl flex flex-col items-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="relative group rounded-3xl overflow-hidden border-8 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] bg-white p-4 rotate-1 hover:rotate-0 transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultImg}
                  alt="Processed Meme"
                  className="w-full h-auto rounded-xl object-contain border-4 border-black"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                <a
                  href={resultImg}
                  download="what-is-toler-looking-at.jpg"
                  className="flex items-center justify-center space-x-3 px-10 py-5 bg-green-400 hover:bg-green-300 text-black rounded-full font-bold text-2xl border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="font-[family-name:var(--font-bangers)] tracking-wide">Download It!</span>
                </a>
                <button
                  onClick={handleReset}
                  className="px-10 py-5 bg-pink-400 hover:bg-pink-300 text-black rounded-full font-bold text-2xl border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all font-[family-name:var(--font-bangers)] tracking-wide"
                >
                  Make Another!
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
