import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import axios from 'axios';

const moodOptions = [
  { emoji: '😊', value: 'happy' },
  { emoji: '😐', value: 'neutral' },
  { emoji: '😔', value: 'sad' },
];

// Static mock mapping for visualization
const mockTraitPercentages = {
  'Luxury Seeker': 85,
  'Eco-conscious': 90,
  'Tech Enthusiast': 78,
  'Minimalist': 60,
  'Adventurous': 70,
  'Budget Conscious': 65,
  'Trend Follower': 75
};

const PersonaCard = ({ userId }) => {
  const [persona, setPersona] = useState(null);
  const [selectedMood, setSelectedMood] = useState('');

  useEffect(() => {
    const fetchPersona = async () => {
      try {
        const res = await axios.post('http://localhost:8000/generate_persona', { user_id: userId });
        setPersona(res.data);
        setSelectedMood(res.data.mood || '');
      } catch (error) {
        console.error('Failed to load persona', error);
      }
    };

    fetchPersona();
  }, [userId]);

  const updateMood = async (mood) => {
    setSelectedMood(mood);
    try {
      await axios.post('http://localhost:8000/submit_behavior', {
        user_id: userId,
        action_type: 'mood_update',
        details: { mood },
      });
    } catch (error) {
      console.error('Mood update failed', error);
    }
  };

  if (!persona) return <div>Loading Persona...</div>;

  return (
    <Card className="w-full p-4 shadow-xl rounded-2xl bg-white">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        <Sparkles className="w-5 h-5" /> Your Persona
      </h2>

      {/* Name */}
      <div className="text-sm text-gray-600 mb-4">
        <strong>Name:</strong> {persona.name || 'Guest'}
      </div>

      {/* Mood Picker */}
      <div className="mb-4">
        <p className="font-medium text-gray-700">Select Your Mood:</p>
        <div className="flex space-x-3 mt-2">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              onClick={() => updateMood(mood.value)}
              className={`text-2xl hover:scale-110 transition ${
                selectedMood === mood.value ? 'ring-2 ring-blue-400 rounded-full' : ''
              }`}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="mt-4">
        <p className="font-medium text-gray-700">Personality Tags:</p>
        <ul className="list-disc list-inside text-sm mt-1 text-gray-600">
          {persona.psychographics?.map((trait, index) => (
            <li key={index}>{trait}</li>
          )) || <li>No data</li>}
        </ul>
      </div>

      {/* Derived Trait Breakdown */}
      {persona.psychographics && (
        <div className="mt-4">
          <p className="font-medium text-gray-700">Psychographic Trait Match %:</p>
          <ul className="text-sm mt-2 space-y-1 text-gray-600">
            {persona.psychographics.map((trait, index) => (
              <li key={index} className="flex justify-between">
                <span>{trait}</span>
                <span className="font-semibold text-gray-800">
                  {mockTraitPercentages[trait] || Math.floor(Math.random() * 30 + 60)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default PersonaCard;
