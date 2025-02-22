import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './app.css';
import { auth, db } from './firebaseConfig';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

const musicGenres = ['Rap', 'Pop', 'Rock', 'Jazz', 'Classical', 'Hip-Hop', 'Electronic'];
const movieGenres = ['Comedy', 'Action', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Documentary'];

export default function OnboardingPage() {
    const [selectedMusicGenres, setSelectedMusicGenres] = useState<string[]>([]);
    const [selectedMovieGenres, setSelectedMovieGenres] = useState<string[]>([]);
    const navigate = useNavigate();
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            const fetchPreferences = async () => {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (userData.musicGenres && userData.movieGenres) {
                        alert('Preferences already exist!');
                    }
                }
            };
            fetchPreferences();
        }
    }, [user]);

    const handleGenreSelection = (genre: string, isMusic: boolean) => {
        const selectedGenres = isMusic ? selectedMusicGenres : selectedMovieGenres;
        const setSelectedGenres = isMusic ? setSelectedMusicGenres : setSelectedMovieGenres;

        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter((g) => g !== genre));
        } else if (selectedGenres.length < 3) {
            setSelectedGenres([...selectedGenres, genre]);
        }
    };

    const handleSubmit = async () => {
        if (user) {
            const userRef = doc(collection(db, 'users'), user.uid);
            await setDoc(userRef, {
                musicGenres: selectedMusicGenres,
                movieGenres: selectedMovieGenres,
            }, { merge: true });
            alert('Preferences saved successfully!');
        }
    };

    return (
        <div className="app-container">
            <h2>Welcome to Harmonify!</h2>
            <p>Select up to 3 of your favorite music and movie genres:</p>

            <div className="card">
                <h3>Music Genres</h3>
                <div className="genre-selection">
                    {musicGenres.map((genre) => (
                        <button
                            key={genre}
                            className={`genre-button ${selectedMusicGenres.includes(genre) ? 'selected purple-bg' : ''}`}
                            onClick={() => handleGenreSelection(genre, true)}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card">
                <h3>Movie Genres</h3>
                <div className="genre-selection">
                    {movieGenres.map((genre) => (
                        <button
                            key={genre}
                            className={`genre-button ${selectedMovieGenres.includes(genre) ? 'selected purple-bg' : ''}`}
                            onClick={() => handleGenreSelection(genre, false)}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            </div>

            <button className="generate-button" onClick={handleSubmit} disabled={selectedMusicGenres.length === 0 || selectedMovieGenres.length === 0}>
                Save Preferences
            </button>
        </div>
    );
}