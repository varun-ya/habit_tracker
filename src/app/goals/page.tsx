'use client';

import { useState, useEffect } from 'react';
import { Plus, Target, Calendar, X } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  category: string;
  completed: boolean;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: 'Personal'
  });

  useEffect(() => {
    const saved = localStorage.getItem('goals');
    if (saved) {
      setGoals(JSON.parse(saved));
    }
  }, []);

  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title.trim(),
      description: newGoal.description.trim(),
      targetDate: newGoal.targetDate,
      progress: 0,
      category: newGoal.category,
      completed: false
    };
    
    saveGoals([...goals, goal]);
    setNewGoal({ title: '', description: '', targetDate: '', category: 'Personal' });
    setIsAdding(false);
  };

  const updateProgress = (id: string, progress: number) => {
    const updatedGoals = goals.map(goal => 
      goal.id === id 
        ? { ...goal, progress, completed: progress >= 100 }
        : goal
    );
    saveGoals(updatedGoals);
  };

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter(goal => goal.id !== id));
  };

  const getDaysUntilTarget = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Goals Tracker</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus size={20} />
          Add Goal
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow mb-6 border">
          <h3 className="text-lg font-semibold mb-4">Add New Goal</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder="Goal title..."
              className="w-full p-2 border rounded"
            />
            <textarea
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              placeholder="Description (optional)..."
              className="w-full p-2 border rounded h-20"
            />
            <div className="flex gap-4">
              <input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                className="p-2 border rounded"
              />
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                className="p-2 border rounded"
              >
                <option value="Personal">Personal</option>
                <option value="Career">Career</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
                <option value="Learning">Learning</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addGoal}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Goal
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewGoal({ title: '', description: '', targetDate: '', category: 'Personal' });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {goals.map(goal => {
          const daysLeft = goal.targetDate ? getDaysUntilTarget(goal.targetDate) : null;
          return (
            <div key={goal.id} className="bg-white p-6 rounded-lg shadow border">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={20} className="text-blue-500" />
                    <h3 className="text-xl font-semibold">{goal.title}</h3>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {goal.category}
                    </span>
                  </div>
                  {goal.description && (
                    <p className="text-gray-600 mb-3">{goal.description}</p>
                  )}
                  {goal.targetDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                      {daysLeft !== null && (
                        <span className={`ml-2 ${daysLeft < 0 ? 'text-red-500' : daysLeft < 7 ? 'text-orange-500' : 'text-green-500'}`}>
                          ({daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`})
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${goal.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              {goal.completed && (
                <div className="mt-3 text-green-600 font-medium">✓ Goal Completed!</div>
              )}
            </div>
          );
        })}
      </div>

      {goals.length === 0 && !isAdding && (
        <div className="text-center py-12 text-gray-500">
          <Target size={48} className="mx-auto mb-4 opacity-50" />
          <p>No goals yet. Set your first goal to get started!</p>
        </div>
      )}
    </div>
  );
}