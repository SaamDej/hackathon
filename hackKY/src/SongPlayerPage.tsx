import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type Song = {
  title: string;
  artist: string;
  youtubeUrl?: string;
};

export default function SongPlayerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const songs: Song[] = location.state?.songs || [];

  return (
    <div style={{width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
      <h1>Recommended Songs</h1>
      {songs.length > 0 ? (
        <ul style={{listStyle: 'none', alignItems: 'center'}}>
          {songs.map((song: Song, index: number) => (
            <li style={{display: 'flex', flexDirection: 'column'}}key={index}>

              {song.youtubeUrl && (
                <iframe
                  width="300"
                  height="180"
                  src={song.youtubeUrl.replace("watch?v=", "embed/")}
                  title={song.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
              <strong>{song.title}</strong> - {song.artist}
            </li>
          ))}
        </ul>
      ) : (
        <p>No songs found for this emotion.</p>
      )}
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}
