import React, { useState, useEffect } from 'react';
import { updateMood } from '../services/api';

const moods = [
  { emoji: '😊', value: 'happy' },
  { emoji: '😐', value: 'neutral' },
  { emoji: '😔', value: 'sad' },
  { emoji: '😡', value: 'angry' },
  { emoji: '😴', value: 'tired' },
  { emoji: '🤩', value: 'excited' }
];

const MoodPicker = ({ customerId }) => {
  const [selectedMood, setSelectedMood] = useState('neutral');

  useEffect(() => {
    // Update mood in backend when it changes
    const updateMoodInBackend = async () => {
      try {
        await updateMood(selectedMood);
      } catch (error) {
        console.error('Error updating mood:', error);
      }
    };

    updateMoodInBackend();
  }, [selectedMood]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">How are you feeling?</h3>
      <div className="flex space-x-4">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(mood.value)}
            className={`text-2xl p-2 rounded-full transition-all ${
              selectedMood === mood.value
                ? 'bg-blue-100 scale-110'
                : 'hover:bg-gray-100'
            }`}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodPicker; 