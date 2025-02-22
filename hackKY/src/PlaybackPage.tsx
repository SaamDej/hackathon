import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PlaybackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { songs } = location.state || { songs: [] };

  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  if (songs.length === 0) {
    return <h2>No songs available</h2>;
  }

  const currentSong = songs[currentSongIndex];

  const playNextSong = () => {
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    }
  };

  const playPreviousSong = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Now Playing 🎵</h1>
      <h2>{currentSong.title} - {currentSong.artist}</h2>
      <iframe
        width="560"
        height="315"
        src={currentSong.youtubeUrl.replace("watch?v=", "embed/")}
        title={currentSong.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={playPreviousSong} 
          disabled={currentSongIndex === 0} 
          style={{ padding: '10px 20px', marginRight: '10px' }}
        >
          ⏮ Previous
        </button>
        
        <button 
          onClick={playNextSong} 
          disabled={currentSongIndex === songs.length - 1} 
          style={{ padding: '10px 20px' }}
        >
          Next ⏭
        </button>
      </div>

      <button 
        onClick={() => navigate('/')} 
        style={{ marginTop: '20px', padding: '10px 20px' }}
      >
        Back to Upload Page
      </button>
    </div>
  );
}
