import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingData, setEditingData] = useState({ text: '', time: '', date: '' });

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!taskInput.trim() || !timeInput || !dateInput) {
      alert('Please fill all fields!');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: taskInput.trim(),
      time: timeInput,
      date: dateInput,
      completed: false
    };

    setTasks([...tasks, newTask]);
    setTaskInput('');
    setTimeInput('');
    setDateInput('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingData({
      text: task.text,
      time: task.time,
      date: task.date
    });
  };

  const saveEdit = (id) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, text: editingData.text, time: editingData.time, date: editingData.date }
        : task
    ));
    setEditingTaskId(null);
    setEditingData({ text: '', time: '', date: '' });
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingData({ text: '', time: '', date: '' });
  };

  const removeLastTask = () => {
    if (tasks.length > 0) {
      setTasks(tasks.slice(0, -1));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="pt-12 pb-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-2"
          >
            TaskFlow
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-24 h-1 bg-gradient-to-r from-[#00ADB5] to-[#00ADB5] mx-auto rounded-full"
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Task Input Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1E1E1E] rounded-2xl p-6 border border-gray-700 shadow-xl"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="text-[#00ADB5]">📝</span>
              Add New Task
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Task Description
                </label>
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full px-4 py-3 bg-[#2D2D2D] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2D2D2D] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2D2D2D] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addTask}
                  className="flex-1 bg-gradient-to-r from-[#00ADB5] to-[#00ADB5] text-white py-3 px-6 rounded-lg font-medium hover:from-[#00ADB5] hover:to-[#00ADB5] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Add Task
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={removeLastTask}
                  className="px-6 py-3 bg-[#00ADB5]/20 text-[#00ADB5] border border-[#00ADB5]/30 rounded-lg font-medium hover:bg-[#00ADB5]/30 transition-all duration-200"
                >
                  Remove Last
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Task List Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1E1E1E] rounded-2xl p-6 border border-gray-700 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <span className="text-[#00ADB5]">📋</span>
                Task Gallery
              </h2>
              <span className="bg-[#00ADB5]/20 text-[#00ADB5] px-3 py-1 rounded-full text-sm font-medium">
                {tasks.length} tasks
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              <AnimatePresence>
                {tasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-6xl mb-4">🎯</div>
                    <p className="text-gray-400">No tasks yet. Add your first task!</p>
                  </motion.div>
                ) : (
                  tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 border border-gray-600 rounded-lg transition-all duration-200 hover:bg-[#2D2D2D]/50 ${
                        task.completed ? 'opacity-75' : ''
                      }`}
                    >
                      {editingTaskId === task.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingData.text}
                            onChange={(e) => setEditingData({...editingData, text: e.target.value})}
                            className="w-full px-3 py-2 bg-[#2D2D2D] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="time"
                              value={editingData.time}
                              onChange={(e) => setEditingData({...editingData, time: e.target.value})}
                              className="px-3 py-2 bg-[#2D2D2D] border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                            />
                            <input
                              type="date"
                              value={editingData.date}
                              onChange={(e) => setEditingData({...editingData, date: e.target.value})}
                              className="px-3 py-2 bg-[#2D2D2D] border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(task.id)}
                              className="flex-1 bg-[#00ADB5]/20 text-[#00ADB5] py-2 px-4 rounded text-sm font-medium hover:bg-[#00ADB5]/30 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex-1 bg-gray-500/20 text-gray-300 py-2 px-4 rounded text-sm font-medium hover:bg-gray-500/30 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              task.completed
                                ? 'bg-[#00ADB5] border-[#00ADB5] text-white'
                                : 'border-gray-400 hover:border-[#00ADB5]'
                            }`}
                          >
                            {task.completed && '✓'}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <p className={`text-white ${task.completed ? 'line-through opacity-75' : ''}`}>
                              {task.text}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                ⏱️ {formatTime(task.time)}
                              </span>
                              <span className="flex items-center gap-1">
                                📅 {formatDate(task.date)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-1 ml-2">
                            <button
                              onClick={() => startEditing(task)}
                              className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded transition-colors"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                              title="Delete"
                            >
                              ❌
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm border-t border-gray-700">
        <p>Thanks for visit 💗</p>
      </footer>
    </div>
  );
};

export default App;
      
