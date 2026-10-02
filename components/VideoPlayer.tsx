"use client";

import { useState } from "react";
import { Play, X as CloseIcon } from "lucide-react";

interface VideoPlayerProps {
  url: string;
  title?: string;
}

export default function VideoPlayer({ url, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Converter URL do YouTube para embed
  const getEmbedUrl = (youtubeUrl: string): string => {
    // Formato: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = youtubeUrl.match(/watch\?v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
    
    // Formato: https://youtu.be/VIDEO_ID
    const shortMatch = youtubeUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }
    
    // Formato: https://www.youtube.com/embed/VIDEO_ID (já está embed)
    if (youtubeUrl.includes("youtube.com/embed/")) {
      return youtubeUrl;
    }
    
    // Vimeo
    if (youtubeUrl.includes("vimeo.com")) {
      const vimeoMatch = youtubeUrl.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
    }
    
    return youtubeUrl;
  };

  const embedUrl = getEmbedUrl(url);

  if (!isPlaying) {
    return (
      <div
        className="relative aspect-video bg-slate-950/80 border border-white/10 hover:border-senai-orange/40 rounded-2xl overflow-hidden group cursor-pointer shadow-2xl transition-all"
        onClick={() => setIsPlaying(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0b1324] to-slate-950 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="bg-gradient-to-tr from-senai-orange to-amber-400 rounded-full mb-3 group-hover:scale-110 group-hover:shadow-glow-orange transition-all duration-300 mx-auto w-16 h-16 flex items-center justify-center shadow-lg text-slate-950">
              <Play className="w-7 h-7 fill-current ml-1" />
            </div>
            {title && (
              <p className="text-white font-display font-semibold text-lg drop-shadow">{title}</p>
            )}
            <p className="text-slate-400 text-xs mt-1 font-mono uppercase tracking-wider">Clique para assistir ao trailer</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <button
        onClick={() => setIsPlaying(false)}
        className="absolute top-3 right-3 z-10 bg-slate-900/80 hover:bg-red-500/80 text-white rounded-full p-2.5 transition backdrop-blur-md border border-white/10"
        aria-label="Fechar vídeo"
      >
        <CloseIcon className="w-5 h-5" />
      </button>
      <iframe
        src={`${embedUrl}?autoplay=1`}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

