import { useState } from 'react';
import { useAI } from '../context/AIContext';

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '🤔', label: 'Thoughtful' },
  { emoji: '🎉', label: 'Excited' },
  { emoji: '🛍️', label: 'Shopping' },
  { emoji: '💪', label: 'Motivated' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😤', label: 'Frustrated' },
];

const MoodSelector = () => {
  const { currentMood, updateMood } = useAI();
  const [selectedMood, setSelectedMood] = useState(currentMood);

  const handleMoodSelect = async (mood) => {
    try {
      await updateMood(mood);
      setSelectedMood(mood);
    } catch (error) {
      console.error('Error updating mood:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">How are you feeling today?</h3>
      <div className="grid grid-cols-4 gap-4">
        {moods.map((mood) => (
          <button
            key={mood.emoji}
            onClick={() => handleMoodSelect(mood.emoji)}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
              selectedMood === mood.emoji
                ? 'bg-flipkart-blue text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span className="text-2xl mb-1">{mood.emoji}</span>
            <span className="text-sm">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector; 