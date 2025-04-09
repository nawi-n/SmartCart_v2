import React, { useEffect, useState } from 'react';
import { fetchPersona, updateBehavior } from '@services/api';
import { Loader2 } from 'lucide-react';

const moodOptions = [
  { emoji: '😃', label: 'Happy' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😎', label: 'Cool' },
  { emoji: '🤔', label: 'Curious' },
  { emoji: '😍', label: 'Romantic' },
  { emoji: '😴', label: 'Lazy' },
];

const Sidebar = ({ customerId }) => {
  const [persona, setPersona] = useState(null);
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPersona = async () => {
    try {
      setLoading(true);
      const data = await fetchPersona(customerId);
      setPersona(data);
    } catch (err) {
      setError('Failed to load persona');
      console.error('Error fetching persona:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateMood = async (selectedMood) => {
    setMood(selectedMood);
    try {
      await updateBehavior({
        customer_id: customerId,
        behavior: {
          mood: selectedMood,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error('Error updating mood:', err);
    }
  };

  useEffect(() => {
    loadPersona();
  }, [customerId]);

  return (
    <div className="w-64 h-screen bg-white border-r p-4 fixed left-0 top-0 z-40 shadow-md">
      <h2 className="text-xl font-semibold mb-4">🧍 Your Persona</h2>

      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
          <span>Loading persona...</span>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : persona ? (
        <div className="mb-6 text-sm">
          <p><strong>Name:</strong> {persona.name}</p>
          <p><strong>Age:</strong> {persona.age}</p>
          <p><strong>Gender:</strong> {persona.gender}</p>
          <p><strong>Interests:</strong> {persona.interests?.join(', ')}</p>
          <p><strong>Personality:</strong> {persona.personality}</p>
          <p><strong>Psychographics:</strong> {persona.psychographics}</p>
        </div>
      ) : (
        <p>No persona data available</p>
      )}

      <h3 className="text-md font-semibold mb-2">🎭 Select Mood</h3>
      <div className="flex flex-wrap gap-2">
        {moodOptions.map((option) => (
          <button
            key={option.label}
            onClick={() => updateMood(option.label)}
            className={`text-xl p-2 rounded-full hover:scale-110 transition-all ${
              mood === option.label ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-100'
            }`}
          >
            {option.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
