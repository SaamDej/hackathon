import axios from "axios";
import qs from "qs";

// Load environment variables
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET!;
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/api/token";

let accessToken: string = "";

const getAccessToken = async (): Promise<string> => {
  if (accessToken) return accessToken; 

  try {
    const response = await axios.post(
      SPOTIFY_AUTH_URL,
      qs.stringify({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error("Error fetching Spotify token", error);
    throw new Error("Failed to get Spotify access token.");
  }
};

/**
 * Search for a playlist based on mood
 * @param mood - The user's mood (e.g., happy, sad, energetic)
 */
export const getPlaylistByMood = async (mood: string) => {
  const token = await getAccessToken();

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: mood,
        type: "playlist",
        limit: 5,
      },
    });

    return response.data.playlists.items;
  } catch (error) {
    console.error("Error fetching playlists", error);
    throw new Error("Failed to fetch playlists.");
  }
};
