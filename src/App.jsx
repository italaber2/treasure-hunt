import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Map } from 'lucide-react';

import location1Image from './assets/images/location1-clue.jpeg';
import location2Image from './assets/images/location3-clue.jpeg';
import location3Image from './assets/images/location3-clue.jpeg';
import location4Image from './assets/images/location4-clue.jpeg';

const TreasureHunt = () => {
  const [answer, setAnswer] = useState('');
  const [showImage, setShowImage] = useState(false);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);

  // Configure your treasure hunt locations here
  // Each location will have its own URL: /#location1, /#location2, etc.
  const locations = {
    theSpot: {
      question: "What's my favourite colour?",
      answer: "blue",
      image: location1Image,
      nextLocation: "theBench"
    },
    theBench: {
      question: "What's my favourite fruit?",
      answer: "watermelon",
      image: location2Image,
      nextLocation: "theWitch"
    },
    theWitch: {
      question: "What's my favourite drink?",
      answer: "dirty chai latte",
      image: location3Image,
      nextLocation: "theRock"
    },
    theRock: {
      question: "What's my favourite Disney movie?",
      answer: "Atlantis",
      image: location4Image,
      nextLocation: null // null means this is the last location
    }
  };

  // Get location from URL hash
  useEffect(() => {
    const getLocationFromUrl = () => {
      const hash = window.location.hash.slice(1); // Remove the #
      return hash || 'theSpot'; // Default to location1 if no hash
    };

    setCurrentLocation(getLocationFromUrl());

    // Listen for hash changes
    const handleHashChange = () => {
      setCurrentLocation(getLocationFromUrl());
      setShowImage(false);
      setAnswer('');
      setError('');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentLoc = locations[currentLocation];
    
    if (answer.toLowerCase().trim() === currentLoc.answer.toLowerCase()) {
      setShowImage(true);
      setError('');
    } else {
      setError('Incorrect answer. Try again!');
      setAnswer('');
    }
  };

  // Show loading state while determining location
  if (!currentLocation || !locations[currentLocation]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Map className="w-16 h-16 mx-auto mb-4 text-amber-700 animate-pulse" />
          <p className="text-xl text-amber-900">Loading location...</p>
        </div>
      </div>
    );
  }

  const currentLoc = locations[currentLocation];
  const isLastLocation = !currentLoc.nextLocation;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <Map className="w-16 h-16 mx-auto mb-4 text-amber-700" />
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Treasure Hunt</h1>
          <p className="text-amber-700">{currentLoc.locationName}</p>
        </div>

        {!showImage ? (
          /* Question Card */
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Answer the question correctly to reveal your next clue
            </h2>
            
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-6 rounded">
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentLoc.question}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer
                </label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  placeholder="Enter your answer..."
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <XCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg"
              >
                Submit Answer
              </button>
            </div>
          </div>
        ) : (
          /* Success & Image Card */
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6 text-green-600">
              <CheckCircle className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Correct</h2>
            </div>

            <p className="text-gray-700 mb-6 text-lg">
              {isLastLocation 
                ? "🎉 Nice work Princess!" 
                : "Here's your clue to find the next location."}
            </p>

            <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
              <img
                src={currentLoc.image}
                className="w-full h-auto"
              />
            </div>

            {isLastLocation && (
              <div className="text-center p-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg">
                <p className="text-white text-2xl font-bold mb-2">
                  🏆 Snackies Found!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TreasureHunt;