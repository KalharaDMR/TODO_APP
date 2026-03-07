// routes/taskRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/auth");
const { tasks } = require("../data/store");

const router = express.Router();

// Get all tasks with filtering
router.get("/", authMiddleware, (req, res) => {
  const { filter, category, priority } = req.query;
  let userTasks = tasks.filter(t => t.userId === req.userId);

  // Apply filters
  if (filter === 'completed') {
    userTasks = userTasks.filter(t => t.completed);
  } else if (filter === 'pending') {
    userTasks = userTasks.filter(t => !t.completed);
  } else if (filter === 'today') {
    const today = new Date().toDateString();
    userTasks = userTasks.filter(t => new Date(t.dueDate).toDateString() === today);
  } else if (filter === 'upcoming') {
    const today = new Date();
    userTasks = userTasks.filter(t => new Date(t.dueDate) > today && !t.completed);
  } else if (filter === 'overdue') {
    const today = new Date();
    userTasks = userTasks.filter(t => new Date(t.dueDate) < today && !t.completed);
  }

  if (category) {
    userTasks = userTasks.filter(t => t.category === category);
  }

  if (priority) {
    userTasks = userTasks.filter(t => t.priority === priority);
  }

  // Sort by due date
  userTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  res.json(userTasks);
});

// Get task statistics
router.get("/stats", authMiddleware, (req, res) => {
  const userTasks = tasks.filter(t => t.userId === req.userId);
  const today = new Date().toDateString();
  
  const stats = {
    total: userTasks.length,
    completed: userTasks.filter(t => t.completed).length,
    pending: userTasks.filter(t => !t.completed).length,
    overdue: userTasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length,
    today: userTasks.filter(t => new Date(t.dueDate).toDateString() === today).length,
    byPriority: {
      high: userTasks.filter(t => t.priority === 'high').length,
      medium: userTasks.filter(t => t.priority === 'medium').length,
      low: userTasks.filter(t => t.priority === 'low').length
    },
    byCategory: {}
  };

  // Group by category
  userTasks.forEach(task => {
    if (task.category) {
      stats.byCategory[task.category] = (stats.byCategory[task.category] || 0) + 1;
    }
  });

  res.json(stats);
});

// Create task with advanced fields
router.post("/", authMiddleware, (req, res) => {
  const { title, description, dueDate, priority, category, tags } = req.body;
  
  const task = {
    id: Date.now(),
    title,
    description: description || '',
    dueDate: dueDate || new Date().toISOString().split('T')[0],
    priority: priority || 'medium',
    category: category || 'Personal',
    tags: tags || [],
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString(),
    userId: req.userId
  };

  tasks.push(task);
  res.json(task);
});

// Update task
router.put("/:id", authMiddleware, (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id == req.params.id && t.userId === req.userId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { title, description, dueDate, priority, category, tags, completed } = req.body;
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title || tasks[taskIndex].title,
    description: description !== undefined ? description : tasks[taskIndex].description,
    dueDate: dueDate || tasks[taskIndex].dueDate,
    priority: priority || tasks[taskIndex].priority,
    category: category || tasks[taskIndex].category,
    tags: tags || tasks[taskIndex].tags,
    completed: completed !== undefined ? completed : tasks[taskIndex].completed,
    completedAt: completed ? new Date().toISOString() : null
  };

  res.json(tasks[taskIndex]);
});

// Delete task
router.delete("/:id", authMiddleware, (req, res) => {
  const index = tasks.findIndex(t => t.id == req.params.id && t.userId === req.userId);
  
  if (index !== -1) {
    tasks.splice(index, 1);
  }

  res.json({ message: "Task deleted" });
});

// Bulk delete completed tasks
router.delete("/completed/all", authMiddleware, (req, res) => {
  const userTasks = tasks.filter(t => t.userId === req.userId);
  const completedTasks = userTasks.filter(t => t.completed);
  
  completedTasks.forEach(task => {
    const index = tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
  });

  res.json({ message: "Completed tasks deleted", count: completedTasks.length });
});

module.exports = router;