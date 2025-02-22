import React, { useState, useEffect, useRef } from 'react';
import { useFirebaseUser } from './FirebaseUserContext';
import { useNavigate } from 'react-router-dom';

export default function UploadImagePage() {
  const { user, userData } = useFirebaseUser();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(true);
  const [songs, setSongs] = useState<Song[]>([]);
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  type Song = {
    title: string;
    artist: string;
    youtubeUrl?: string;
  };

  useEffect(() => {
    console.log("Logged in user:", user?.email);
    console.log("User full name:", userData?.firstName, userData?.lastName);
  }, [user, userData]);

  useEffect(() => {
    if (isWebcamActive) {
      const startWebcam = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing webcam:", error);
        }
      };
      startWebcam();
    }
  }, [isWebcamActive]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setIsWebcamActive(false);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload or capture an image first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("http://10.30.2.175:5050/detect-emotion", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze emotion.");
      }

      const data = await response.json();
      setEmotion(data.emotion);
    } catch (error) {
      console.error("Error detecting emotion:", error);
      alert("Error analyzing the image.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (emotion && !hasFetched.current) {
      fetchSongs(emotion);
      hasFetched.current = true;
    }
  }, [emotion]);

  const fetchSongs = async (emotion: string) => {
    try {
        const response = await fetch('http://localhost:5001/api/get-songs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emotion }), 
        });

        if (!response.ok) {
            throw new Error('Failed to fetch songs.');
        }

        const data = await response.json();
        setSongs(data.songs);
    } catch (error) {
        console.error('Error fetching songs:', error);
        alert('Error fetching song recommendations.');
    }
  };


  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context && videoRef.current.videoWidth > 0) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured.png", { type: "image/png" });
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setIsWebcamActive(false);
          }
        }, "image/png");
      }
    }
  };

  const retakeImage = () => {
    setImage(null);
    setImagePreview(null);
    setIsWebcamActive(true);
  };

  return (
    <div className="app-container">
      <h1 style={{marginBottom: '0'}}>Hi, {userData?.firstName}</h1>
      <h2 style={{marginBottom: '1rem', width: '70%', color: 'white'}}>Let's find some music and movies that match your mood.</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: "1rem", alignItems: "center" }}>
        {imagePreview ? (
          <div style={{width: "350px", borderRadius: "1rem"}}>
            <img src={imagePreview} width="350px" alt="Uploaded or Captured" className="preview" />
          </div>
        ) : (
          <div style={{width: "350px", borderRadius: "1rem"}}>
            <video ref={videoRef} autoPlay playsInline style={{ width: "350px", borderRadius: "1rem", transform: "scaleX(-1)" }}></video>
          </div>
        )}

        <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          {!imagePreview && <button onClick={takePhoto} className='button-1'>Take Photo</button>}
          {!imagePreview && 
          <label className='button-1'>
            Upload Photo
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>
          }
        </div>
        {imagePreview && (
          <button onClick={retakeImage} style={{backgroundColor: 'red'}} className='button-1'>Retake Image</button>
        )}
        {imagePreview && (
        <button onClick={handleSubmit} disabled={loading} className='button-1'>
          {loading ? "Analyzing..." : "Submit Image"}
        </button>
        )}
          {/* Display Songs & YouTube Video Embeds */}
          {songs.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Recommended Songs</h3>
            <ul>
              {songs.map((song, index) => (
                <li key={index}>
                  <strong>{song.title}</strong> - {song.artist}
                  {song.youtubeUrl && (
                    <div style={{ marginTop: '10px' }}>
                      <iframe
                        width="300"
                        height="180"
                        src={song.youtubeUrl.replace("watch?v=", "embed/")}
                        title={song.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
