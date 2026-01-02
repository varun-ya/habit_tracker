'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const moods = [
  { emoji: '😊', label: 'Happy', value: 5 },
  { emoji: '😌', label: 'Content', value: 4 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '😔', label: 'Sad', value: 2 },
  { emoji: '😢', label: 'Very Sad', value: 1 },
];

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (selectedMood === null) return;
    
    const moodEntry = {
      mood: selectedMood,
      notes,
      date: new Date().toISOString(),
    };
    
    const existingEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    existingEntries.push(moodEntry);
    localStorage.setItem('moodEntries', JSON.stringify(existingEntries));
    
    setSelectedMood(null);
    setNotes('');
    alert('Mood saved!');
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-5 gap-4">
            {moods.map((mood) => (
              <Button
                key={mood.value}
                variant={selectedMood === mood.value ? "default" : "outline"}
                className="h-20 flex flex-col"
                onClick={() => setSelectedMood(mood.value)}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-sm">{mood.label}</span>
              </Button>
            ))}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Notes (optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What's on your mind?"
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={selectedMood === null}
            className="w-full"
          >
            Save Mood
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}