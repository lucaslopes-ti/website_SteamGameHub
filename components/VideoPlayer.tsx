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
      <div className="relative aspect-video bg-steam-dark rounded-lg overflow-hidden group cursor-pointer" onClick={() => setIsPlaying(true)}>
        <div className="absolute inset-0 bg-gradient-to-br from-steam-blue to-steam-darker flex items-center justify-center">
          <div className="text-center">
            <div className="bg-steam-blueLight bg-opacity-80 rounded-full p-6 mb-4 group-hover:bg-opacity-100 transition mx-auto w-20 h-20 flex items-center justify-center">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
            {title && (
              <p className="text-white font-semibold text-lg">{title}</p>
            )}
            <p className="text-gray-300 text-sm mt-2">Clique para assistir</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-steam-dark rounded-lg overflow-hidden">
      <button
        onClick={() => setIsPlaying(false)}
        className="absolute top-2 right-2 z-10 bg-black bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-2 transition"
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

