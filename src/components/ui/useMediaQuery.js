// src/hooks/useMediaQuery.js
import { useState, useEffect } from 'react';

/**
 * A custom hook to detect if a media query matches the current viewport.
 * @param {string} query - The media query to match (e.g., '(max-width: 768px)').
 * @returns {boolean} - Returns `true` if the media query matches, otherwise `false`.
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create a MediaQueryList object
    const mediaQueryList = window.matchMedia(query);

    // Update the state when the media query matches
    const handleChange = (event) => setMatches(event.matches);
    setMatches(mediaQueryList.matches); // Set initial state

    // Add event listener for changes
    mediaQueryList.addEventListener('change', handleChange);

    // Cleanup function to remove the event listener
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};